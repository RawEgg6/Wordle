const test = "xxoxx"

function occurance(word){
    occur = {}
    for(i in word){
        if(word[i] in occur)
            occur[word[i]]++;
        else
            occur[word[i]] = 1;
    }
    return occur
}

function initOccurance(word){
    occur = {}
    for(i in word){
        if(word[i] in occur)
            continue;
        else
            occur[word[i]] = 0;
    }
    return occur
}

function handle(word){
    let position = {};
    const testOccur = occurance(test)
    let wordOccur = initOccurance(word)

    for(i in word){
        if(word[i] == test[i]){
            if(testOccur[word[i]] == wordOccur[word[i]]){
                for(key in position){
                    if(word[key] == word[i] && position[key] == "position"){
                        delete position[key]
                        position[i] = "correct"
                    }
                }
            }
            else{
                position[i] = "correct"
                wordOccur[word[i]]++;
                
            }
        }
        else{
            for(let j = 0; j<5; j++){
                if(word[i] == test[j]){
                    if(testOccur[word[i]] > wordOccur[word[i]]){
                        position[i] = "position"
                        wordOccur[word[i]]++
                        break;
                    }
                }
            }
        }
    }
    return position;
}
handle("goons")