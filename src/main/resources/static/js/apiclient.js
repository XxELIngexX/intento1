var apiclient = (function () {
    var apiUrl = "http://localhost:8080/api";

    return {

        createPlayer: function (player, callback) { 
            $.ajax({
                url: `${apiUrl}/players`,
                method: "POST",
                data: JSON.stringify(player),
                contentType: "application/json",
                success: function (response) { 
                    callback(response); // Pasa el jugador creado con el ID al callback
                },
                error: function (error) {
                    console.error("Error al crear el jugador:", error);
                }
            });
        },

        getAllPlayers: function (callback) {
            $.get(`${apiUrl}/players`, function (data) {
                callback(data);
            }).fail(function (error) {
                console.error("Error al obtener jugadores:", error);
            });
        },
        renderPlayers: function (players) {
            const playersList = $('#players-list'); 
            playersList.empty(); // Limpia el contenido existente
        
            this.getTeamById("1", (teamA) => {
                playersList.append(`<h1>Equipo A</h1>`);
                //playersList.append(`<table border="1"><tr><th>Jugador</th></tr>`);
                teamA.players.forEach(player => {
                    playersList.append(`<tr><td>${player.name}</td></tr>`);
                });
                playersList.append(`</table>`);
        
                // Después de renderizar Equipo A, obtener y renderizar los jugadores de Equipo B
                this.getTeamById("2", (teamB) => {
                    playersList.append(`<h1>Equipo B</h1>`);
                    //playersList.append(`<table border="1"><tr><th>Jugador</th></tr>`);
                    teamB.players.forEach(player => {
                        playersList.append(`<tr><td>${player.name}</td></tr>`);
                    });
                    playersList.append(`</table>`);
                });
            });
        },

        createTeams: function (name,imagenPath,callback) {
            const teamData = {
                name: name,
                imagenPath: imagenPath
            };
            
        
            $.ajax({
                url: `${apiUrl}/teams`,
                method: "POST",
                data: JSON.stringify(teamData), // Envía el objeto como JSON
                contentType: "application/json",
                
                error: function (error) {
                    console.error("Error al crear el equipo:", error);
                }
            });
        },
        getTeamByName: function (name, callback) {
            $.get(`${apiUrl}/teams/name/${name}`, function (data) {
                callback(data);
            }).fail(function (error) {
                if (error.status === 404) {
                    callback(null); // Llama al callback con null si el equipo no existe
                } else {
                    console.error("Error al obtener equipos:", error);
                }
            });
        },

        getTeamById: function(id, callback) {
            $.get(`${apiUrl}/teams/${id}`, function(data) {
                if (callback) {
                    callback(data);
                }
            }).fail(function(error) {
                console.error("Error al obtener equipos:", error);
            });
        },

        getPlayerById: function (id, callback) {
            $.get(`${apiUrl}/players/${id}`, function (data) {
                callback(data);
            }).fail(function (error) {
                console.error("Error al obtener equipos:", error);
            });
        },

        captureFlag: function (playerId, callback) {
            $.ajax({
                url: `${apiUrl}/players/${playerId}/capture-flag`, 
                method: "POST",
                success: function (response) {
                    callback(response);
                },
                error: function (error) {
                    console.error("Error al capturar la bandera:", error);
                }
            });
        }
    };
    
})();
$(document).ready(function () {
    const currentPage = window.location.pathname;
    if (currentPage === '/lobby') {
        apiclient.renderPlayers(); // Usar `renderPlayers` como callback
    }
    if (currentPage === '/') {

        apiclient.getTeamByName("EquipoA", function(teamA) {
            if (!teamA) { 
                apiclient.createTeams("EquipoA", "../images/playerA.png");
            }
        });
        
       
        apiclient.getTeamByName("EquipoB", function(teamB) {
            if (!teamB) { 
                apiclient.createTeams("EquipoB", "../images/playerB.png");
            }
        });
    }
});