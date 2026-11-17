export const capstonePrototype = import.meta.env.MODE === 'capstone'
export const releaseBuild = !['development', 'trial', 'test', 'capstone'].includes(import.meta.env.MODE)
export const showDeveloperTools = !releaseBuild && !capstonePrototype
export const ageConfirmationKey = 'howhouse:age14:v1'
