//changing font size
export const navigateFontSize = (currentSize, direction) => {
    let fontSet = [
        {
            "h1":26,
            "h3":20,
            "p":14
        },
        {
            "h1":30,
            "h3":24,
            "p":16
        },
        {
            "h1":32,
            "h3":28,
            "p":18
        }
    ]

    if (direction == "inc" && currentSize < fontSet.length- 1){
        return {
            fontSet: fontSet[currentSize + 1],
            size:currentSize + 1,
            
        };
    }
    
    if (direction == "dec" && currentSize > 0){
        return {
            fontSet: fontSet[currentSize - 1],
            size:currentSize - 1,
            
        };
    } 


    return {
        fontSet: fontSet[currentSize],
        size:currentSize,  
    };
}

