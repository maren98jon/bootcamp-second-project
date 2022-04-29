let apikey = "RGAPI-0bbf03c5-d9a7-463a-b409-03dec4bea92d";
let sumId;
// const jsondata = require("./media/languages/data/es_ES/champion.json")
// console.log(jsondata)
document.querySelector("#getSumData").addEventListener("click",
    function (e) {
        e.preventDefault();
        getEncryptedId();
    })

function getEncryptedId() {

    console.log(document.querySelector('#summonerName').value)
    fetch(`https://${document.querySelector('#region').value}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${document.querySelector('#summonerName').value}?api_key=${apikey}`)
        .then(function (res) {
            return res.json();
        })
        .then(function (res) {//aqui res.id me da la id del summoner
            console.log(res.id);
            fetch(`https://${document.querySelector('#region').value}.api.riotgames.com/lol/league/v4/entries/by-summoner/${res.id}?api_key=${apikey}`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (response) {
                    console.log(response)
                    console.log(document.querySelector('#rankedType').value);
                    response.forEach(x => {
                        if (x.queueType == document.querySelector('#rankedType').value) {
                            console.log(document.querySelector('#rankedType').value);
                            var layout = {
                                title: "All data"
                            };
                            var data = [{
                                labels: [`${x.wins} wins`, `${x.losses} losses`],
                                values: [x.wins, x.losses],
                                hole: .5,
                                type: "pie"
                            }];
                            let tipoCola;
                            if (x.queueType == "RANKED_SOLO_5x5") {
                                tipoCola = "Ranked SoloDuo"
                            } else {
                                tipoCola = "Ranked Flex"
                            }
                            document.querySelector("#showData").innerHTML = `
                            <div id="summonerCard" onclick="showBestChamp()">
                        <div id="summonerSum">
                            <p id="queue">${tipoCola}</p>
                            <img src="./tiericons/${x.tier.toLowerCase()}_${x.rank.toLowerCase()}.png" alt="iconoElo">
                            <p>${x.tier} ${x.rank}</p>
                            <p>${x.leaguePoints} LP</p>
                        </div>
                        <div id="summonerPrinc">
                            <h3>${document.querySelector('#summonerName').value}</h3>
                            <p>${x.wins} Wins/ ${x.losses} Loses</p>
                            <div id="plotContainer">
                            <canvas id="graph"></canvas>
                            </div>
                            <p> winrate ${parseFloat(x.wins * 100 / (x.wins + x.losses)).toFixed(2)} % </p>
                            
                            
                        </div>
                            `
                            var graph = document.getElementById("graph");
                            var myPieChart = new Chart(graph, {
                                type: 'pie',
                                data: {
                                    labels: ['Wins', 'Losses'],
                                    datasets: [{
                                        label: "Winrate",
                                        data: [x.wins, x.losses],
                                        backgroundColor: ["#189DFF", "#FE210B"]
                                    }]
                                }
                            })

                            // <div id="myPlot"></div>
                            // Plotly.newPlot("myPlot", data, layout);
                        }
                    })


                })


        })

}

// document.querySelector("#summonerCard").addEventListener("mouseover",
//     function (e) {
//         e.preventDefault();
//         showBestChamp();
//     })
// function showBestChamp(){

//     document.querySelector("#summonerCard").style.background = "blue";
// }

document.querySelector("#searchLive").addEventListener("click",
    function (e) {
        e.preventDefault();
        showLiveGame();
    })
function showLiveGame() {
    fetch(`https://${document.querySelector('#regionLive').value}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${document.querySelector('#summonerliveName').value}?api_key=${apikey}`)
        .then(function (res) {
            return res.json();
        })
        .then(function (res) {//aqui res.id me da la id del summoner
            console.log(res.id);
            fetch(`https://${document.querySelector('#regionLive').value}.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${res.id}?api_key=${apikey}`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (response) {//response tiene todos los datos de una partida en directo
                    console.log(response);
                    console.log("en partida");

                    document.querySelector("#bothTeams").innerHTML = "";
                    document.querySelector("#bothTeams").innerHTML = `
                    <div id="firstTeam">

                        </div>
                        <div id="secondTeam">


                        </div>
                    `;

                    for (let i = 0; i < 5; i++) {
                        document.querySelector("#firstTeam").innerHTML += `
                        <div class="summonerInfo">
                            <div>${response.participants[i].summonerName}</div>
                            <div id="${response.participants[i].summonerId}"></div>
                            <div class="spells">
                                <div>${response.participants[i].spell1Id}</div>
                                <div>${response.participants[i].spell2Id}</div>
                            </div>
                        </div>
                        `
                        document.querySelector("#secondTeam").innerHTML += `
                        <div class="summonerInfo">
                            <div>${response.participants[i + 5].summonerName}</div>
                            <div id="${response.participants[i+5].summonerId}"></div>
                            <div class="spells">
                                <div>${response.participants[i + 5].spell1Id}</div>
                                <div>${response.participants[i + 5].spell2Id}</div>
                            </div>
                        </div>
                        `


                    }
                    
                    for (let i = 0; i < 10; i++) {
                        getWinRate(response.participants[i].summonerId)
                        
                    }
                })
        })

}

function getWinRate(sumId) {

    
            fetch(`https://${document.querySelector('#region').value}.api.riotgames.com/lol/league/v4/entries/by-summoner/${sumId}?api_key=${apikey}`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (response) {
                    console.log("estoooooooooo")
                    console.log(response[0]);
                    console.log(parseFloat(response[0].wins * 100 / (response[0].wins + response[0].losses)).toFixed(2));
                    document.getElementById(sumId).innerHTML = `${parseFloat(response[0].wins * 100 / (response[0].wins + response[0].losses)).toFixed(2)}%`
                    
                    //tengo k pintar en el cuadrado suyo el WR+

                })
        
}

// let mydata = JSON.parse()

function ShowOptions() {
    fetch(`./media/languages/data/${document.querySelector("#language").value}/${document.querySelector("#searchType").value}.json`)
        .then(function (res) {
            return res.json();
        })
        .then(function (res) {
            document.querySelector("#fillContainer").innerHTML = `
                <option selected disabled>Choose one</option>
            `
            console.log(res);
            if (document.querySelector("#searchType").value == "champion") {
                for (let x in res.data) {
                    document.querySelector("#fillContainer").innerHTML += `
                <option>${x}</option>
            `
                }
            } else if (document.querySelector("#searchType").value == "item") {
                for (let x in res.data) {
                    document.querySelector("#fillContainer").innerHTML += `
                <option value="${x}">${res.data[x].name}</option>
            `
                }
            } else if (document.querySelector("#searchType").value == "summoner") {
                for (let x in res.data) {
                    document.querySelector("#fillContainer").innerHTML += `
                <option value="${res.data[x].id}">${res.data[x].name}</option>
            `
                }
            }


        })

}


function deleteFavs(){
    
    localStorage.clear();
}

document.querySelector("#filterItem").addEventListener("click",
    function (e) {
        e.preventDefault();
        showOptionInfo();
    })

function showOptionInfo() {
    let language = document.querySelector("#language").value;
    let option = document.querySelector("#searchType").value;
    let thing = document.querySelector("#fillContainer").value;
    if (option == "champion") {
        fetch(`./media/languages/data/${language}/champion/${thing}.json`)
            .then(function (res) {
                return res.json();
            })
            .then(function (res) {
                let champ = res.data[thing];
                let insert = "";
                for (let i = 0; i < champ.tags.length; i++) {
                    insert += `<p>${champ.tags[i]}</p>`

                }
                document.querySelector("#showOtherData").innerHTML = `
            <div id="champData">
                            <div>
                                <h2>${champ.name}</h2>
                                <p>${champ.title}</p>
                            </div>
                            <div>
                                ${insert}
                            </div>
                        </div>
                        <div>
                            <img src="./media/img/champion/splash/${thing}_0.jpg" alt="champphoto">
                        </div>
                        <div>
                            <p>
                                ${champ.lore}
                            </p>
                        </div>
            `
            })
    } else if (option == "item") {
        fetch(`./media/languages/data/${language}/item.json`)
            .then(function (res) {
                return res.json();
            })
            .then(function (res) {

                let item = res.data[thing];
                console.log(item);
                document.querySelector("#showOtherData").innerHTML = `
            <div id="itemHeader">
            <div>
                <h2>${item.name}</h2>
            </div>
            <div>
                <img src="./media/languages/img/item/${thing}.png" alt="itemphoto">
            </div>
        </div>
        <div>
            
            <p>
                ${item.plaintext}
            </p>
            <p>
                ${item.gold.base} gold
            </p>
        </div>
            `
            })
    } else if (option == "summoner") {
        fetch(`./media/languages/data/${language}/summoner.json`)
            .then(function (res) {
                return res.json();
            })
            .then(function (res) {

                let summoner = res.data[thing];
                console.log(summoner);
                document.querySelector("#showOtherData").innerHTML = `
            <div id="summonerHeader">
            <div>
                <h2>${summoner.name}</h2>
            </div>
            <div>
                <img src="./media/languages/img/spell/${summoner.id}.png" alt="itemphoto">
            </div>
        </div>
        <div>
            
            <p>
                ${summoner.description}
            </p>
            
        </div>
            `
            })
    }

}

document.querySelector("#mySummoner").addEventListener("click", function (e) {
    e.preventDefault();
    if (document.querySelector("#summonerName").value !== "") {
        addFav();
    }
})

function addFav() {
    if (localStorage.getItem(document.querySelector("#summonerName").value)) {

    } else {
        let summObj = {
            name: document.querySelector("#summonerName").value,
            region: {
                id: document.querySelector("#region").value,
                name: (document.querySelector("#region")).options[(document.querySelector("#region")).selectedIndex].text,
            }
        }
        let summForm = JSON.stringify(summObj);
        localStorage.setItem(document.querySelector("#summonerName").value, summForm)
    }
    showFavs();
    getEncryptedId();
}

function fillAllData() {
    let region = "";
    let sumArray = allStorage();
    for (let i = 0; i < sumArray.length; i++) {
        let summoner = JSON.parse(sumArray[i]);
        if (summoner.name == document.querySelector("#myFavs").value) {
            region = summoner.region.id;
        }
    }
    document.querySelector("#summonerName").value = document.querySelector("#myFavs").value;
    document.querySelector("#summonerliveName").value = document.querySelector("#myFavs").value;
    document.querySelector("#region").value = region;
    document.querySelector("#regionLive").value = region;
    getEncryptedId();
}

showFavs();
function showFavs() {
    document.querySelector("#myFavs").innerHTML = `<option selected disabled>Select favourite</option>`
    let sumArray = allStorage();
    for (let i = 0; i < sumArray.length; i++) {
        let summoner = JSON.parse(sumArray[i]);
        document.querySelector("#myFavs").innerHTML += `<option>${summoner.name}</option>
        `
    }
}

function allStorage() {
    var values = [],
        keys = Object.keys(localStorage),
        i = keys.length;

    while (i--) {
        values.push(localStorage.getItem(keys[i]));
    }

    return values;
}
