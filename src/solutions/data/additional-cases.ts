import csv0 from './additional62/cases0.csv?raw'
import csv1 from './additional62/cases1.csv?raw'
import csv2 from './additional62/cases2.csv?raw'
import csv3 from './additional62/cases3.csv?raw'
import guides from './additional62/refined-guides.json' with {type:'json'}
import videos from './additional62/videos.json' with {type:'json'}
import {convertCsv} from './convert'
import {applyAdditionalGuides} from './additional-guides'
export const additionalCases = applyAdditionalGuides([...convertCsv("난방·전기", csv0, {}), ...convertCsv("해충·곰팡이", csv1, {}), ...convertCsv("욕실·수도", csv2, {}), ...convertCsv("가전", csv3, {})], guides, videos)
