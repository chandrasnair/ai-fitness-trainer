const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

const connectDB = require('./config/db')
const testRoutes = require('./routes/testRoutes')
const authRoutes = require('./routes/authRoutes')
const path = require('path')
const uploadRoutes = require('./routes/uploadRoutes')
const workoutRoutes = require('./routes/workoutRoutes')
const historyRoutes = require('./routes/historyRoutes')
const recipeRoutes = require('./routes/recipeRoutes')
const userRoutes = require('./routes/userRoutes')
const dietTargetRoutes = require('./routes/dietTargetRoutes')
const mealPlanRoutes = require('./routes/mealPlanRoutes')
const aiCoachRoutes = require('./routes/aiCoachRoutes')


dotenv.config()

connectDB()

const app = express()

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))


app.use('/api/test', testRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/workout', workoutRoutes)
app.use('/api/history', historyRoutes)
app.use('/api/ai-coach', aiCoachRoutes)
app.use('/api/recipes', recipeRoutes)
app.use('/api/users', userRoutes)
app.use('/api/diet-targets', dietTargetRoutes)
app.use('/api/meal-plans', mealPlanRoutes)


app.get('/', (req, res) => {
  res.send('FitFusion Backend Running')
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})