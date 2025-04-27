

export function random(len: number){
    let options = "dfjkasljnweoangoanweignoiwehagjnweiahgnelgiawegnwleriahtg";
    let ans = "";
    for(let i = 0; i < len; i++){
        ans += options[Math.floor(Math.random() * len)]
    }
    return ans;
}