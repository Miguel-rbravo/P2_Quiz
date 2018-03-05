const {log,biglog,errorlog,colorize} = require("./out");
const model = require('./model');

/**
 *Muestra la ayuda
 *
 * @param rl Objeto readline usado para implementar el CLI
 */
exports.helpCmd = rl => {
    log("Comandos:");
    log("   h|help - Muestra esta ayuda.");
    log("   list - Listar los quizzes existentes.");
    log("   show <id> - Muestra la pregunta y la respuesta del quiz indicado.");
    log("   add - Añadir un nuevo quiz interactivamente.");
    log("   delete <id> - Borrar el quiz indicado.");
    log("   edit <id> - Editar el quiz indicado.");
    log("   test <id> - Probar el quiz indicado.");
    log("   p|play - Jugar a preguntas aleatoriamente todos todos los quizzes.");
    log("   credits - Créditos.");
    log("   q|quit - Salir del programa.");
    rl.prompt();
};

/**
 * Terminar el programa.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 */

exports.quitCmd =rl => {
    rl.close();
};

/**
 * Añade nuevo quiz al modelo.
 * Pregunta interactivamente por la pregunta y por la respuesta.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 */

exports.addCmd = rl => {
    rl.question(colorize('Introduzca una pregunta: ','red'), question => {
        rl.question(colorize('Introduzca una respuesta ','red'), answer => {

            model.add(question,answer);
            log(`${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>','magenta')} ${answer}`);
            rl.prompt();
        });
    });
};


/**
 * Lista todos los quizzes existentes en el modelo.
 *
 * @param rl Objeto readline que implementa el CLI
 */
exports.listCmd = rl => {
    model.getAll().forEach((quiz,id) => {
        log(`  [${colorize(id,'magenta')}]: ${quiz.question}`);
    });
    rl.prompt();
};


/**
 * Muestra el quiz indicado en el parámetro: la pregunta y la respuesta.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 * @param id Clave del quiz a mostrar.
 */
exports.showCmd = ( rl,id )=> {
    if (typeof id === "undefinded") {
        errorlog(`Falta el parámetro id.`);
    } else {
        try {
            const quiz = model.getByIndex(id);
            log(` [${colorize(id,"magenta")}]: ${quiz.question} ${colorize('=>','magenta')} ${quiz.answer}`);
        } catch (error) {
            errorlog(error.message);
        }
    }
    rl.prompt();
};

/**
 * Prueba un quiz, es decir, hace una pregunta del modelo a la que debemos contestar.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 * @param id Clave del quiz a probar.
 */

exports.testCmd = (rl,id) => {
    if (typeof id === "undefinded") {
        errorlog(`Falta el parámetro id.`);
        rl.prompt();
    } else {
        try {
            const quiz = model.getByIndex(id);
            rl.question(colorize('¿'+quiz.question+'? ','red'), resp => {
                if (resp.trim().toLowerCase() === quiz.answer.trim().toLowerCase()){
                    biglog('CORRECTO','green');
                    rl.prompt();
                } else {
                    biglog('INCORRECTO','red');
                    rl.prompt();
                }
            });

        } catch (error) {
            errorlog(error.message);
            rl.prompt();

        }
    }

};

/**
 * Prueba un quiz, es decir, hace una pregunta del modelo a la que debemos contestar.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 * @param id Clave del quiz a probar.
 */

exports.testCmd = (rl,id) => {
    if (typeof id === "undefinded") {
        errorlog(`Falta el parámetro id.`);
        rl.prompt();
    } else {
        try {
            const quiz = model.getByIndex(id);
            rl.question(colorize('¿'+quiz.question+'? ','red'), resp => {
                if (resp.trim().toLowerCase() === quiz.answer.trim().toLowerCase()){
                    biglog('CORRECTO','green');
                    rl.prompt();
                } else {
                    biglog('INCORRECTO','red');
                    rl.prompt();
                }
            });

        } catch (error) {
            errorlog(error.message);
            rl.prompt();

        }
    }

};

/**
 * Pregunta todos los quizzes existentes en el modelo en orden aleatorio.
 * Se gana si se contesta a todos satisfactoriamente.
 *
 * @param rl
 */
exports.playCmd = rl => {
    let score = 0;
    let toBeResolved = [];
    let copy=model.getAll();

    for (let i =0;i<model.count();i++) {
        toBeResolved[i] = i;
    }


    const playOne = () => {
        if(toBeResolved.length === 0){
            log('Ha contestado todas las preguntas, su puntuación es : ','blue');
            biglog(score,'magenta');
            rl.prompt();

        } else {

           let id = Math.floor(Math.random()*toBeResolved.length);
            toBeResolved.splice(id,1);
            let quiz = copy[id];
            copy.splice(id,1)
            rl.question(colorize('¿'+ quiz.question+'? ','red'), respuesta =>{
                if (respuesta.trim().toLowerCase() === quiz.answer.trim().toLowerCase()){
                    score++;

                    log('¡CORRECTO!, Lleva '+score+' aciertos','green')
                    playOne();
                }
                else {
                    biglog('¡INCORRECTO!','red')
                    log('Fin del juego, '+'Su puntuación es: ','cian');
                    biglog(score,'orange');

                    rl.prompt();
                }
            });

        }
    }
    playOne();
};

/**
 * Borra un quiz del modelo.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 * @param id CLave del quiz a borrar en el modelo.
 */

exports.deleteCmd = (rl,id) => {
    if (typeof id === "undefinded") {
        errorlog(`Falta el parámetro id.`);
    } else {
        try {
            model.deleteByIndex(id);
        } catch (error) {
            errorlog(error.message);
        }
    }

    rl.prompt();
};


/**
 * Edita un quiz del modelo
 *
 * @param rl Objeto readline usado para implementar el CLI.
 * @param id Clave del quiz a editar en el modelo.
 */
exports.editCmd =(rl,id)  => {
    if (typeof id === "undefinded") {
        errorlog(`Falta el parámetro id.`);
        rl.prompt();
    } else {
        try {
            const quiz = model.getByIndex(id);

            process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);
            rl.question(colorize('Introduzca una pregunta: ','red'),question => {
                process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);
                rl.question(colorize('Introduzca la respuesta ','red'),answer => {
                    model.update(id,question,answer);
                    log(` Se ha cambiado el quiz ${colorize(id,"magenta")} por: ${question} ${colorize('=>','magenta')} ${answer}`);
                    rl.prompt();
                });
            });

        } catch (error) {
            errorlog(error.message);
            rl.prompt();
        }
    }






    rl.prompt();
};


/**
 * Muestra los nombres de los autores de la práctca.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 * @param rl
 */
exports.creditsCmd = rl => {
    log("Autores de la práctica.");
    log("MIGUEL RUBIO BRAVO.");
    log("LUIS FELIPE VELEZ FLORES.");
    rl.prompt();
};