var db;


document.addEventListener('deviceready', onDeviceReady, false);


function onDeviceReady() {
    db = window.sqlitePlugin.openDatabase(
        { name: 'mokde.db', location: 'default' },
        function () {
            alert("Everything is setup!");
        },
        function () {

            alert("DB Failed to open!");

        } 

    );
    db.transaction(
        function (tx) {
            var query = "CREATE TABLE IF NOT EXISTS mokde (id INTEGER PRIMARY KEY AUTOINCREMENT, nickname TEXT NOT NULL, username TEXT NOT NULL, password TEXT NOT NULL)";
            tx.executeSql(query, [],
                function (tx, result) {
                    
                },
                function (err) {
                    alert("error occured:" + err.code);
                }
            );
        }
    );

    db.transaction(
        function (tx) {
            tx.executeSql('SELECT * FROM mokde', [],
                function (tx, results) {
                    var len = results.rows.length;
                  
                    if (len > 0) {
                        htmlText = "";
                    //0 -->1 -->2 
                        for (i = 0; i < len; i++) {
                           
                            htmlText = htmlText + "<tr><td>" + (i + 1) + "</td><td>" + results.rows.item(i).nickname + "</td><td>" + "<a href='#viewUser/" + result.rows.item(i).id + "'>" + (i + 1) + "<span class='glyphicon glyphicon-zoom-in'></span></a>" + "</td></tr>";
                        }
                        $('#tblmokde tbody').html(htmlText);
                    }

                    else {
                        htmlText = "<tr><td>No data found!</td></tr>"
                        $('#tblmokde tbody').html(htmlText);
                    }
                    $('#divUserList').show();
                    $('#divFrmShowUser').hide();
                    $('#divFrmInputUser').hide();
                    $("#divFrmUpdateUser").hide();
                }
            );
        }
    );



}



$(document).ready(function () {

    $('#divAddUserBtn').show();

    function parseHash(newHash, oldHash) {
        crossroads.parse(newHash);
    }
    hasher.initialized.add(parseHash); //parse initial hash
    hasher.changed.add(parseHash); //parse hash changes
    hasher.init(); //start listening for history change
    hasher.setHash(link1);
    hasher.setHash(link2);
    hasher.setHash(link3);
    hasher.setHash(link4);
    hasher.setHash(link5);

    var link1 = crossroads.addRoute("supplier", function () {
        db.transaction(
            function (tx) {
                tx.executeSql('SELECT * FROM mokde', [],
                    function (tx, results) {
                        var len = results.rows.length;

                        if (len > 0) {
                            htmlText = "";
                            for (i = 0; i < len; i++) {
                                htmlText = htmlText + "<tr><td>" + (i + 1) + "</td><td>" + results.rows.item(i).nickname + "</td><td>" + "<a href='#viewUser/" + results.rows.item(i).id + "'>" + (i + 1) + "<span class='glyphicon glyphicon-zoom-in'></span></a>" + "</td></tr>";
                            }
                            $('#tblmokde tbody').html(htmlText);
                        }

                        else {
                            htmlText = "<tr><td>No data found!</td></tr>"
                            $('#tblmokde tbody').html(htmlText);
                        }
                        $('#divUserList').show();
                        $('#divFrmShowUser').hide();
                        $('#divFrmInputUser').hide();
                        $("#divFrmUpdateUser").hide();
                        $("#divFrmEditUser").hide();
                    }
                );
            }
        );





    });

    var link2 = crossroads.addRoute('viewUser/{id}', function (id) {
        var ids = String(parseInt(id));

        

        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM mokde where id = ?', [ids],
                function (tx, results) {
                    


                    var id = results.rows.item(0).id;
                    var nickname = String(results.rows.item(0).nickname);
                    var username = String(results.rows.item(0).username);
                    var password = String(results.rows.item(0).password);


                    $("#idshow").val(id);
                    $("#nicknameshow").val(nickname);
                    $("#usernameshow").val(username);
                    $("#passwordshow").val(password);
                    var editId = String("#btnEdit/" + id)
                    var deleteId = String("#btnDelete/" + id)
                    $("#btnPencil").attr("href", editId)
                    $("#btnDelete").attr("href", deleteId)
                });
        });

        $('#divUserList').hide();
        $('#divFrmShowUser').show();
        $('#divFrmInputUser').hide();
        $("#divFrmUpdateUser").hide();
        $("#divFrmEditUser").hide();



    });

    var link3 = crossroads.addRoute('btnAddUser', function () {

        $("#divFrmInputUser").show();
        $('#divUserList').hide();
        $('#divFrmShowUser').hide();
        $("#divFrmUpdateUser").hide();
        $("#divFrmEditUser").hide();



    });

    var link4 = crossroads.addRoute('btnEdit/{id}', function (id) {
        var ids = String(parseInt(id));

        

        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM mokde where id = ?', [ids],
                function (tx, results) {
                    

                    var id = results.rows.item(0).id;
                    var nickname = String(results.rows.item(0).nickname);
                    var username = String(results.rows.item(0).username);
                    var password = String(results.rows.item(0).password);


                    $("#useridedit").val(id);
                    $("#nicknameshow").val(nickname);
                    $("#usernameshow").val(username);
                    $("#passwordedit").val(password);

                });
        });


        $("#divFrmEditUser").show();
        $('#divUserList').hide();
        $('#divFrmShowUser').hide();
        $('#divFrmInputUser').hide();
        $("#divFrmUpdateUser").hide();







    });


    var link5 = crossroads.addRoute("btnDelete/{id}", function (id) {
        var ids = String(parseInt(id));

        

        db.transaction(function (tx) {
            var result = confirm("Want to delete?");
            if (result) {
                alert("The deleted id is :" + ids);
                tx.executeSql('DELETE FROM mokde where id = ?', [ids],
                    function (tx, results) {
                        alert("User ID is deleted");
                    });
            } else {
                alert("account not deleted")
            }

        });



    });




    $("#divFrmInputUser").submit(function (e) {
        e.preventDefault();
        e.stopPropagation();

        //get the value from form
        var nickname = $("#nicknameinput").val();
        var username = $("#usernameinput").val();
        var password = $("#passwordinput").val();

        //db transaction

        db.transaction(function (tx) {
            var query = "INSERT INTO mokde (nickname, username, password) values(?, ?, ?)";
            tx.executeSql(query, [nickname, username, password],
                function (tx, results) {
                    alert("Data Inserted!");


                },
                function (error) {
                    alert("Error, try again!");
                }
            );
        });
    });

    $("#divFrmEditUser").submit(function (e) {

        e.preventDefault();
        e.stopPropagation();

        var id = $("#useridedit").val();
        var nickname = $("#nicknameedit").val();
        var username = $("#usernameedit").val();
        var password = $("#passwordedit").val();

        db.transaction(function (tx) {
           
            var query = "UPDATE mokde SET nickname=?, username=? , password=? WHERE id =?";
            alert("Run update sql successfully!");
            tx.executeSql(query, [nickname, username, password, id],
                function (tx, results) {
                    alert("User Updated!");
                },
                function (error) {
                    alert("Failed to update!");
                }

            )

        })

    })





});

