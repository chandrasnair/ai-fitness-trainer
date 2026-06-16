const { GoogleGenerativeAI } = require('@google/generative-ai')
const WorkoutHistory = require('../models/WorkoutHistory')

const getBasicStats = async (userId) => {
  const history = await WorkoutHistory.find({ user: userId }).sort({
    createdAt: -1
  })

  const totalWorkouts = history.length

  const totalReps = history.reduce(
    (sum, item) => sum + Number(item.reps_completed || 0),
    0
  )

  const totalCaloriesRaw = history.reduce(
    (sum, item) => sum + Number(item.calories_burned || 0),
    0
  )

  const totalCalories = Number(totalCaloriesRaw.toFixed(2))

  const averageAccuracy =
    history.length > 0
      ? Math.round(
          history.reduce(
            (sum, item) => sum + Number(item.accuracy || 0),
            0
          ) / history.length
        )
      : 0

  const recentWorkouts = history.slice(0, 3).map((item) => ({
    exercise: item.exercise,
    reps_completed: item.reps_completed || 0,
    calories_burned: item.calories_burned || 0,
    accuracy: item.accuracy || 0
  }))

  return {
    totalWorkouts,
    totalReps,
    totalCalories,
    averageAccuracy,
    recentWorkouts
  }
}

const buildPrompt = (stats, question) => {
  const recentWorkoutText =
    stats.recentWorkouts.length > 0
      ? stats.recentWorkouts
          .map(
            (item) =>
              `${item.exercise}: ${item.reps_completed} reps, ${item.calories_burned} kcal, ${item.accuracy}% accuracy`
          )
          .join('\n')
      : 'No recent workouts yet.'

  return `
You are FitFusion AI Coach.

User progress:
Total workouts: ${stats.totalWorkouts}
Total reps: ${stats.totalReps}
Total calories: ${stats.totalCalories}
Average form accuracy: ${stats.averageAccuracy}%

Recent workouts:
${recentWorkoutText}

User question:
${question.trim()}

Rules:
- Reply in 4 to 6 short lines.
- Be friendly, safe, and beginner-friendly.
- Give practical workout, nutrition, recovery, or posture advice.
- Do not give medical diagnosis.
- If the user mentions pain, injury, dizziness, chest pain, fainting, or breathing difficulty, tell them to stop exercising and consult a medical professional.
`
}

const askGemini = async (prompt) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY missing')
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      maxOutputTokens: 160,
      temperature: 0.6
    }
  })

  const result = await model.generateContent(prompt)
  const response = await result.response

  return response.text()
}

const askOllama = async (prompt) => {
  const ollamaModel = process.env.OLLAMA_MODEL || 'llama3.2:1b'

  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: ollamaModel,
      prompt,
      stream: false,
      options: {
        temperature: 0.6,
        num_predict: 180
      }
    })
  })

  if (!response.ok) {
    throw new Error('Ollama request failed')
  }

  const data = await response.json()

  return data.response
}

const getSafeFallbackReply = (stats, question) => {
  const lowerQuestion = question.toLowerCase()

  if (
    lowerQuestion.includes('pain') ||
    lowerQuestion.includes('injury') ||
    lowerQuestion.includes('dizzy') ||
    lowerQuestion.includes('chest pain') ||
    lowerQuestion.includes('breathing')
  ) {
    return 'Stop exercising for now and do not push through pain. Rest, avoid intense movement, and consult a medical professional if symptoms continue. Safety comes before progress.'
  }

  if (lowerQuestion.includes('food') || lowerQuestion.includes('meal') || lowerQuestion.includes('nutrition')) {
    return 'For recovery, focus on a protein-rich meal, enough water, and balanced carbs after training. Keep meals simple and consistent. Avoid skipping food after hard workouts.'
  }

  if (lowerQuestion.includes('push') || lowerQuestion.includes('push-up')) {
    return 'For better push-ups, keep your body straight, brace your core, and lower with control. Start with fewer clean reps instead of rushing. Increase reps slowly as your form improves.'
  }

  if (lowerQuestion.includes('recover') || lowerQuestion.includes('rest')) {
    return 'For recovery, sleep well, hydrate, and avoid training the same tired muscles too hard. Light stretching and rest days help your body adapt. Recovery is part of progress.'
  }

  return `Based on your current progress, focus on controlled reps, steady posture, and consistency. You have completed ${stats.totalWorkouts} workouts and ${stats.totalReps} reps so far. Train slowly, avoid rushing movements, and recover properly after each session.`
}

const askAICoach = async (req, res) => {
  try {
    const { question } = req.body

    if (!question || !question.trim()) {
      return res.status(400).json({
        reply: 'Please ask a question first.'
      })
    }

    const stats = await getBasicStats(req.user._id)
    const prompt = buildPrompt(stats, question)

    try {
      const geminiReply = await askGemini(prompt)

      if (geminiReply && geminiReply.trim()) {
        return res.status(200).json({
          source: 'gemini',
          reply: geminiReply
        })
      }

      throw new Error('Gemini returned empty reply')
    } catch (geminiError) {
      console.log('Gemini failed, trying Ollama fallback...')
      console.log('Gemini error:', geminiError.message)

      try {
        const ollamaReply = await askOllama(prompt)

        if (ollamaReply && ollamaReply.trim()) {
          return res.status(200).json({
            source: 'ollama',
            reply: ollamaReply
          })
        }

        throw new Error('Ollama returned empty reply')
      } catch (ollamaError) {
        console.log('Ollama fallback failed. Using safe fallback reply.')
        console.log('Ollama error:', ollamaError.message)

        return res.status(200).json({
          source: 'fallback',
          reply: getSafeFallbackReply(stats, question)
        })
      }
    }
  } catch (error) {
    console.error('AI Coach full error:', error)

    return res.status(500).json({
      reply: 'FitFusion AI Coach is currently unavailable. Please try again later.'
    })
  }
}

module.exports = { askAICoach }