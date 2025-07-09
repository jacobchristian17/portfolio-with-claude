import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface ThemeProps {
    isDarkMode: boolean;
}

const initialState: ThemeProps = {
    isDarkMode: true
}

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.isDarkMode = !state.isDarkMode
        }
    }
})

export const { toggleTheme } = themeSlice.actions
export default themeSlice.reducer