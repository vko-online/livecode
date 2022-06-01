import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import settingsReducer from './settingsReducer'

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
  }
})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export type RootState = ReturnType<typeof store.getState>
