import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Settings {
  fontSize: number
  language: string
  theme: string
}

const initialState: Settings = {
  fontSize: 16,
  language: 'javascript',
  theme: 'monokai'
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setFontSize(state, action: PayloadAction<number>) {
      state.fontSize = action.payload
    },
    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload
    },
    setTheme(state, action: PayloadAction<string>) {
      state.theme = action.payload
    }
  }
})

const { actions, reducer } = settingsSlice
export const { setFontSize, setLanguage, setTheme } = actions
export default reducer