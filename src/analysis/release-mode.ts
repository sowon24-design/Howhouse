export const releaseBuild = !['development', 'trial', 'test'].includes(import.meta.env.MODE)
export const showDeveloperTools = !releaseBuild
export const ageConfirmationKey = 'howhouse:age14:v1'
