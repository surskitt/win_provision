[CalcResolution]
Measure=Calc
Formula=(#ScreenAreaWidth# < 1280) ? (1280) : ((#ScreenAreaWidth# > 1920) ? (1920) : ((#ScreenAreaWidth#=1400) ? (1440) : ((#ScreenAreaWidth#=1600) ? (1680) : (#ScreenAreaWidth#))))
