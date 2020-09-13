/*
 * UNO REMAKE
 *
 * Realizzato da: Matteo Galletta, Flavio Carpinteri, Kevin Speranza
 * nel giorno: 01/09/2020
 * con la libreria: p5.js
 * dal sito: https://www.p5js.org
 * 
 * JavaScript & p5js imparati da: Daniel Shiffman
 *   a.k.a. The Coding Train
 *     @ https://www.youtube.com/c/TheCodingTrain
 * 
 * Regole Ufficiali UNO prese da: https://www.officialgamerules.org/uno
 *
 * Versione Software: v1.0a
 *
 */

/* --- Variabili ---
 (Possono essere omesse, mantenute per questioni di ordine)*/

/* Dimensioni della carta rispetto al canvas.
 *  Più RATIO è alto, più le dimensioni delle
 *  carte saranno inferiori.
 *  Esempio:
 *  RATIO = 13 -> Le carte occuperanno un quinto dello schermo (1/13)
 * è suggerito lasciare questo valore invariato.
 */


/*
 * var MazzoN; // Conta il numero di carte presenti all'interno del mazzo
 * var contaFrame; // Conta il numero dei frame, utilizzato per funzioni di Animazioni. (Pausa)
 * var turnoAttuale; // Indica il giocatore a cui tocca effettuare la mossa
 * var coloreAttuale; // Indica il colore attuale
 * var carteDaDare; // Flag che indica se assegnare le carte ai giocatori
 * var puoCliccare; // Flag che indica se il giocatore ha il permesso di cliccare
 * var botHaGiocato; // Flag che indica se il bot in quel turno ha giocato
 * var deveScegliereColore; // Flag che indica se il giocatore deve scegliere un colore
 * var sensoOrario; // Flag che indica se il senso è orario o antiorario
 * var deveCliccareUno; // Flag che indica se il player deve o meno cliccare Uno
 * var unoCount; // Serve a far partire un timer per il tasto Uno
 * var statoCrediti; // Flag per gestire l'apertura del popup "crediti"
 * var menuMostrato; // Flag che rappresenta la presenza/assenza del menu
 * var giocoTerminato; // Flag che indica la fine del gioco
 * var punteggioCalcolato; // Flag che indica se il punteggio è stato calcolato o meno
 * var counterStampaIsOn; // Flag che indica se il counterStampa è attivo
 * var counterStampa; // Serve a stampare la classifica con un delay
 * var altezzaCanvas; // Conserva l'altezza del canvas
 * var larghezzaCanvas; // Conserva la larghezza del canvas
 * var cartaTerra = { // Rappresenta la carta a terra
 *   Valore: 0,
 *   Colore: 0
 * };
 * var imageWidth; // Larghezza di ogni carta
 * var imageHeight; // Altezza di ogni carta
 * var sfondoCrediti; // Conserva l'immagine sfondo dei crediti
 * var fontClassifica;
*/

//Costanti
const RATIO = 13;
const NumeroGiocatori = 4; // non modificare

var wallpapers = []; // Conserva gli sfondi, che cambiano in base al colore attuale
var senso = []; // Conserva le immagini delle frecce che indicano il giro attuale
var imageMenu = []; // Conserva le immagini inerenti al menu
var classificaImage = []; // Conserva le immagini per la classifica finale
var Mazzo = []; // Contiene tutte le carte del mazzo da cui verranno pescate le carte
var carteGiocatoriN = []; // Conserva il numero di carte che ogni giocatore ha
var punteggio = [];

var Immagini = [ // Conserva le immagini di tutte le carte
  [], // Blue 
  [], // Green
  [], // Red
  [], // Yellow
  []  // Gray
];
var carteGiocatori = [ // Contiene le carte dei giocatori
  [], // Giocatore 1 [Bottom]
  [], // Giocatore 2 [Left]
  [], // Giocatore 3 [Top]
  []  // Giocatore 4 [Right]
];


 /*******************************************
 *                                          *
 *   Viene eseguita prima della funzione    *
 *  setup(). Carica le immagini all'interno *
 *   delle strutture dati, per evitare di   *
 *  appesantire il programma in esecuzione  *
 *                                          *
 *******************************************/
function preload() {
  for(let i = 0; i < 13; i++) {
    Immagini[0][i] = loadImage("Carte\\blue\\" + i + ".png");
    Immagini[1][i] = loadImage("Carte\\green\\" + i + ".png");
    Immagini[2][i] = loadImage("Carte\\red\\" + i + ".png");
    Immagini[3][i] = loadImage("Carte\\yellow\\" + i + ".png");
  }
  Immagini[4][0] = loadImage("Carte\\13.png"); // CambioColore
  Immagini[4][1] = loadImage("Carte\\14.png"); // +4
  Immagini[4][2] = loadImage("Carte\\back.png"); // Retro Carta
  
  for(let i = 0; i < 5; i++) {
    wallpapers[i] = loadImage("Wallpapers\\" + i + ".jpg");
  }
  
  
  senso[0] = loadImage("Senso\\0.png");
  senso[1] = loadImage("Senso\\1.png");
  
  for(let i = 0; i < 3; i++) {
    imageMenu[i] = loadImage("Menu\\" + i + ".jpg");
  }
  
  for(let i = 0; i < 3; i++) {
    classificaImage[i] = loadImage("Classifica\\" + i + ".jpg");
  }
  
  sfondoCrediti = loadImage("Menu\\3.jpg");
  fontClassifica = loadFont("Fonts\\0.ttf");
}

 /*******************************************
 *                                          *
 *   Viene eseguito solo all'inizio del     *
 *   programma, usato per inizializzare     *
 *   variabili, strutture dati, e canvas    *
 *    termine e stampa tutto il canvas      *
 *                                          *
 *******************************************/
function setup() {
  // Dimensione del canvas che si adatta alla larghezza dello schermo.
  // Il formato forzato corrisponde a 16:9.
  
  fullscreen(true);
 
  calcolaDimensioniCanvas();

  createCanvas(larghezzaCanvas, altezzaCanvas);
  //createCanvas(960, 540);
  //createCanvas(1920,1080);
  //fullscreen(true);
  frameRate(60);
  InizializzaGioco();
}

 /*******************************************
 *                                          *
 *    Calcola le dimensioni del canvas.     *
 *    Lo adatta in modo tale che sia in     *
 *   formato 16:9, e che nulla sia fuori    *
 *              dallo schermo               *
 *                                          *
 *******************************************/
function calcolaDimensioniCanvas() {
  larghezzaCanvas = window.innerWidth;
  altezzaCanvas = window.innerHeight;

  let RatioSchermo = larghezzaCanvas / altezzaCanvas;

  if(RatioSchermo > 1.78) {
    larghezzaCanvas = altezzaCanvas * 1.78;
  } else {
    altezzaCanvas = larghezzaCanvas / 1.78;
  }
}

 /*******************************************
 *                                          *
 *     Funzione inserita in parallelo       *
 *   all'aggiunta della schermata finale.   *
 *  Imposta i valori predifiniti, in modo   *
 *  tale da permettere al gioco di partire  *
 *  correttamente, con i parametri corretti *
 *                                          *
 *******************************************/
function InizializzaGioco() {
  contaFrame = 0;
  imageMode(CENTER);
  angleMode(DEGREES);
  MazzoN = 0; Mazzo = [];
  /*while(Mazzo.lenght > 0) {
  	Mazzo.pop();
  }
  while(punteggio.lenght > 0) {
  	punteggio.pop();
  }*/
  InizializzaMazzo();
  cartaTerra = PescaCarta();
  sensoOrario = true;
  deveCliccareUno = false;
  unoCount = 0; contaFrame = 0;
  statoCrediti = false;
  menuMostrato = true;
  giocoTerminato = false;
  punteggioCalcolato = false;

  counterStampaIsOn = true;
  
  for(let i = 0; i < 4; i++) {
    carteGiocatoriN[i] = 0;
  }
  
  if(cartaTerra.Colore != 4) {
    coloreAttuale = cartaTerra.Colore;
    deveScegliereColore = false;
  }
  else {
    coloreAttuale = 4;
    deveScegliereColore = true;
  }
  
  DimensioniCarta();
  turnoAttuale = 0; // Inizia il giocatore 0
  carteDaDare = true;
  puoCliccare = false;
  
  for(let n = 0; n < NumeroGiocatori; n++)
    carteGiocatoriN[n] = 0;
  
  
}

 /*******************************************
 *                                          *
 *  Viene ripetuto in loop, renderizza al   *
 *    termine e stampa tutto il canvas      *
 *                                          *
 *******************************************/
function draw() {
  
  // Adatta il canvas allo schermo correttamente
  calcolaDimensioniCanvas();
  resizeCanvas(larghezzaCanvas, altezzaCanvas);
  DimensioniCarta();
  
  // Se il flag giocoTerminato è vero, la classifica viene mostrata
  if(giocoTerminato) {
    classifica();
    return;
  }
  // Se il flag menuMostrato è vero, il menu viene mostrato
  if(menuMostrato) {
    menu();
    return;
  }
  
  imageMode(CENTER);
  
  // Stampa la prima carta, che viene disposta al centro del canvas.
  image(wallpapers[coloreAttuale], width/2, height/2, width, height);
  
  image(senso[(sensoOrario?1:0)], width/2, height/2, senso[(sensoOrario?1:0)].width/(1920/width), senso[(sensoOrario?1:0)].height/(1080/height));
  
  // Stampa la carta che rappresenta il mazzo
  if(MazzoN > 0)
    StampaCarta(width/2 - imageWidth/1.15, height/2, 15, 4);
  
  // Stampa la carta a terra, quindi l'ultima buttata
  StampaCarta(width/2 + imageWidth/1.15, height/2, cartaTerra.Valore, cartaTerra.Colore);
  
  // Se la condizione è vera, le carte non devono più essere distribuite
  if(carteDaDare && carteGiocatoriN[NumeroGiocatori - 1] == 7) {
    carteDaDare = false;
    turnoAttuale = 0;
    puoCliccare = true;
  }
  
  if(contaFrame == 10 && carteDaDare) { // Vengono distribuite 6 carte al secondo (60/10)
    contaFrame = 0;
    carteGiocatori[turnoAttuale][carteGiocatoriN[turnoAttuale]] = PescaCarta();
    carteGiocatoriN[turnoAttuale]++;
    
    turnoAttuale = GiocatoreSuccessivo(turnoAttuale);
    
  }
  
  if(carteDaDare == false) {
  	
  	let n = carteGiocatoriN[turnoAttuale];
  	stroke(255, 255, 255);
  	strokeWeight(int(0.0026042*width));
  	fill(255,255,255,40)
  	rectMode(CENTER);
  		

  	if(turnoAttuale == 0 || turnoAttuale == 2) {
  		
  		let Larghezza = (n/2 + 1)*imageWidth;
  		let Altezza = 1.25*imageHeight;

  		let y = (turnoAttuale == 0) ? (height-height/7) : height/7;
  		rect(width/2, y, Larghezza, Altezza, imageHeight/5);

  	} else
  	if(turnoAttuale == 1 || turnoAttuale == 3) {
  		let Larghezza = imageWidth*1.25;
  		let Altezza = (n/3 + 1)*imageHeight;

  		let x = ((turnoAttuale == 1) ? width/12.5 : (width - width/12.5));
  		rect(x, height/2, Larghezza, Altezza, imageHeight/5);
  	}
  }

  for(let n = 0; n < NumeroGiocatori; n++) {
    StampaMazzo(n);
  }
  
  // --- INIZIO GIOCO ---
  
  if(contaFrame == 90 && deveScegliereColore == false) { // Tra un bot e l'altro, passano 120 frames
    
    if(turnoAttuale != 0)  
      TurnoBot(turnoAttuale);

  }
  
  if(deveCliccareUno == true) {
    unoCount++;
  }
  
  if(unoCount == 150) {
    deveCliccareUno = false;
    unoCount = 0;
    
    carteGiocatori[0][carteGiocatoriN[0]++] = PescaCarta();
    carteGiocatori[0][carteGiocatoriN[0]++] = PescaCarta();
    
  }
  
  if(MazzoN == 0) giocoTerminato = true;

  // Timer: 90 frame -> Un secondo e mezzo
  if(contaFrame == 90) contaFrame = 0;
  else contaFrame++;
}

 /*******************************************
 *                                          *
 * Gestisce il funzionamento del tasto uno  *
 *                                          *
 *******************************************/
function mouseClicked() {
  if(mouseX >= width/2 - imageWidth/4 &&
     mouseX <= width/2 + imageWidth/4 &&
     mouseY >= height/2 - imageHeight/3 &&
     mouseY <= height/2 + imageHeight/3) {
     
    if(deveCliccareUno == true) {
      deveCliccareUno = false;
      unoCount = 0;
    }
    else {
      unoCount = 150;
    }
  }
  
}


 /*******************************************
 *                                          *
 *  Quando una delle carte è premuta viene  *
 *  gettata a terra. Premendo sul mazzo è   *
 *possibile pescare E' possibile scegliere  *
 * il colore grazie a questa funzione, dopo *
 *     aver buttato un CambioColore / +4    *
 *                                          *
 *******************************************/
function mousePressed() {
  
  if(menuMostrato) return;
  
  if(deveScegliereColore) {
    
    let centerX = width/2;
    let centerY = height/2;
    
    // Coordinate corrispondenti all'angolo in alto a sinistra dei pulsanti
    
    // Se il mouse tocca il pulsante...
    if(mouseX >= centerX - (width/34 + imageWidth + width/128) &&
       mouseX <= centerX + (width/34 + imageWidth + width/128) &&
       mouseY >= centerY - (imageHeight/2 + width/35) &&
       mouseY <= centerY - (imageHeight/2 + width/128)) { //...Blu (Sopra)
      coloreAttuale = 0;
    } else
    if(mouseX >= centerX - (width/34 + imageWidth + width/128) &&
       mouseX <= centerX + (width/34 + imageWidth + width/128) &&
       mouseY >= centerY + (imageHeight/2 + width/128) &&
       mouseY <= centerY + (imageHeight/2 + width/35)){ //...Verde (Sotto)
      coloreAttuale = 1;
    } else
    if(mouseX >= centerX - (width/34 + imageWidth + width/35) &&
       mouseX <= centerX - (width/34 + imageWidth + width/128)&&
       mouseY >= centerY - (imageHeight/2) &&
       mouseY <= centerY + (imageHeight/2)) { //...Rosso (Sinistra)
      coloreAttuale = 2;
    } else
    if(mouseX >= centerX + (width/34 + imageWidth + width/128) &&
       mouseX <= centerX + (width/34 + imageWidth + width/35)&&
       mouseY >= centerY - (imageHeight/2) &&
       mouseY <= centerY + (imageHeight/2)) { //...Giallo (Destra)
      coloreAttuale = 3;
    }
    if(coloreAttuale != 4) {
      deveScegliereColore = false;
      //turnoAttuale = GiocatoreSuccessivo(turnoAttuale);
    }
    return;
  }
  
  //if(puoCliccare == false) return false;
  if(turnoAttuale != 0) return false;
  
  // Coordinate centrali della carta del mazzo
  let xMazzo = width/2 - imageWidth/1.15;
  let yMazzo = height/2;
  
  // Controllo per prendere una carta dal mazzo
  if((mouseX >= xMazzo - imageWidth/2) &&
     (mouseX <= xMazzo + imageWidth/2) &&
     (mouseY >= yMazzo - imageHeight/2) &&
     (mouseY <= yMazzo + imageHeight/2)) {
     
     carteGiocatori[0][carteGiocatoriN[0]] = PescaCarta();
     carteGiocatoriN[0]++;
     turnoAttuale = GiocatoreSuccessivo(turnoAttuale);
  }
  
  // Controllo per l'ultima carta, con area quindi doppia
  if((mouseX >= carteGiocatori[0][carteGiocatoriN[0]-1].X - imageWidth/2) &&
     (mouseX <= carteGiocatori[0][carteGiocatoriN[0]-1].X + imageWidth/2) &&
     (mouseY >= carteGiocatori[0][carteGiocatoriN[0]-1].Y - imageHeight/2) &&
     (mouseY <= carteGiocatori[0][carteGiocatoriN[0]-1].Y + imageHeight/2)) {
    let bef = carteGiocatori[0][carteGiocatoriN[0]-1];
    GettaCarta(0,carteGiocatoriN[0]-1);
    let aft = carteGiocatori[0][carteGiocatoriN[0]-1];
    if(bef != aft)
      turnoAttuale = GiocatoreSuccessivo(turnoAttuale);
  }
  // Controllo per tutte le carte, esclusa l'ultima
  for(let n = 0; n < carteGiocatoriN[0]; n++) {
    
    // Controlla se il mouse abbia cliccato una carta
    if((mouseX >= carteGiocatori[0][n].X - imageWidth/2) &&
       (mouseX <= carteGiocatori[0][n].X ) &&
       (mouseY >= carteGiocatori[0][n].Y - imageHeight/2) &&
       (mouseY <= carteGiocatori[0][n].Y + imageHeight/2)) {
      
      if(carteGiocatori[0][n].Colore == 4) {
        deveScegliereColore = true;
      }
      
      // Se si clicca su una carta che non è possibile
      // buttare, il turno non viene sprecato.
      let bef = carteGiocatori[0][n];
      GettaCarta(0, n);
      let aft = carteGiocatori[0][n];
      if(bef != aft)
        turnoAttuale = GiocatoreSuccessivo(turnoAttuale);

    
    }
    
  }
  contaFrame = 0;
}

 /*******************************************
 *                                          *
 *  Gestisce il turno successivo in gioco   *
 *     basandosi sul flag sensoOrario       *
 *                                          *
 *******************************************/
function GiocatoreSuccessivo(Giocatore) {
  if(sensoOrario) {
    
    if(Giocatore == 3) return 0;
    else return Giocatore + 1;
    
  } else {
    
    if(Giocatore == 0) return 3;
    else return Giocatore -1;
    
  }
}

 /*******************************************
 *                                          *
 *  Viene gestito il turno del bot, quindi  *
 * butta la carta e pesca quando necessario *
 *                                          *
 *******************************************/
function TurnoBot(Giocatore) {
  let Carte = carteGiocatori[Giocatore];
  let N = carteGiocatoriN[Giocatore];
  
  let daButtareValore = -10;
  let index = -1;
  
  let colors = [0,0,0,0];
  let modified = [];
  
  for(let n = 0; n < N; n++) {
    let Carta = Carte[n];
    
    // Tiene conto del colore più presente nel mazzo del bot
    if(Carta.Colore != 4)
      colors[Carta.Colore]++;
    
    // Buttano le carte grigie solo se non ne hanno di nessun'altro tipo
    if(Carta.Colore == 4) {
      Carta.Valore -= 15;
      modified[n] = true;
    } else modified[n] = false;
    if((Carta.Valore == cartaTerra.Valore || // HANNO VALORE DIVERSO
        Carta.Colore == coloreAttuale || // HANNO COLORE UGUALE
        Carta.Colore == 4 ) && // LA CARTA DA BUTTARE E' GRIGIA
          Carta.Valore > daButtareValore ){ // Si preferisce buttare una carta con valore elevato
      
      daButtareValore = Carta.Valore;
      index = n;
      
    }
  }
  
  for(let n = 0; n < N; n++) {
    if(modified[n] == true)
      Carte[n].Valore += 15;
  }
  
  
  
  if(index != -1) {
    // Prende il colore con più frequenza in mano
    let max = -1, maxIndex = -1;
    for(let i = 0; i < 4; i++) {
      if(colors[i] > max) {
        maxIndex = i;
        max = colors[i];
      }
    }
    GettaCarta(Giocatore, index, maxIndex);
  }
  else {
    carteGiocatori[Giocatore][carteGiocatoriN[Giocatore]] = PescaCarta();
    carteGiocatoriN[Giocatore]++;
  }
  turnoAttuale = GiocatoreSuccessivo(turnoAttuale);
  
  
}

 /*******************************************
 *                                          *
 *  Una volta specificato il giocatore e    *
 * l'indice della carta, quest'ultima viene *
 * buttata in campo, qualora sia possibile  *
 *                                          *
 *******************************************/
function GettaCarta(Giocatore, index, ColoreBOT) {
  let isGray = false;
  
  let CartaDaButtare = carteGiocatori[Giocatore][index];
  
  if(CartaDaButtare.Valore != cartaTerra.Valore &&
     CartaDaButtare.Colore != coloreAttuale){
    
    if(CartaDaButtare.Colore == 4) isGray = true;
    else return false; 
  }
  
  
  if(CartaDaButtare.Valore == cartaTerra.Valore ||
     CartaDaButtare.Colore == coloreAttuale ||
     isGray) {
    
    cartaTerra.Valore = carteGiocatori[Giocatore][index].Valore; // debug1
    cartaTerra.Colore = carteGiocatori[Giocatore][index].Colore;
    
    if(carteGiocatori[Giocatore][index].Colore != 4) {
      coloreAttuale = cartaTerra.Colore;      
    }
    else {
      if(Giocatore == 0) {
        coloreAttuale = 4;
        deveScegliereColore = true;
      }
      else {
        coloreAttuale = ColoreBOT;
      }
    }
    
    
    carteGiocatori[Giocatore][index] =
      carteGiocatori[Giocatore][--carteGiocatoriN[Giocatore]];
    
  }
  
  if(cartaTerra.Valore == 10) {
      turnoAttuale = GiocatoreSuccessivo(turnoAttuale);
  } else
  if(cartaTerra.Valore == 11) {
    sensoOrario = !sensoOrario;
  } else
  if(cartaTerra.Valore == 12) {
    let x = GiocatoreSuccessivo(turnoAttuale);
    carteGiocatori[x][carteGiocatoriN[x]++] = PescaCarta();
    carteGiocatori[x][carteGiocatoriN[x]++] = PescaCarta();
    turnoAttuale = x;
  } else
  if(cartaTerra.Valore == 14) {
    let x = GiocatoreSuccessivo(turnoAttuale);
    for(let n = 0; n < 4; n++) {
      carteGiocatori[x][carteGiocatoriN[x]++] = PescaCarta();
    }
    turnoAttuale = x;
  }
  
  if(carteGiocatoriN[Giocatore] == 0) {
    giocoTerminato = true;
    print("GettaCarta(" + Giocatore);
  }
  
  if(Giocatore == 0 && carteGiocatoriN[Giocatore] == 1) {
    deveCliccareUno = true;
  }
  
  
}



 /*******************************************
 *                                          *
 * Passato come valore il giocatore scelto, *
 * ne stampa sul lato appropriato il mazzo  *
 *                                          *
 *******************************************/
function StampaMazzo(Giocatore) {
  let Carte = carteGiocatori[Giocatore];
  let CarteN = carteGiocatoriN[Giocatore]
  
  let Distance = -imageHeight/3;
  let val = (CarteN - 1)/2;
  var start;  
  var x_, y_;
  if(Giocatore == 0) { // Le carte vengono stampate nella parte inferiore del canvas
    
    // Posizione iniziale per stampare le carte perfettamente al centro
    let start = width/2 - (val*imageWidth+val*Distance);

    // Ogni carta viene stampata
    for(let n = 0; n < CarteN; n++) {
      x_ = start+n*imageWidth+n*Distance;
      y_ = height-height/7;
      
      // Salva le coordinate delle carte appena piazzate
      carteGiocatori[0][n].X = x_;
      carteGiocatori[0][n].Y = y_;
      
      // Stampa la carta
      StampaCarta(x_, y_, Carte[n].Valore, Carte[n].Colore);
    }
    
    
  } else
  if(Giocatore == 1) { // Le carte vengono stampate nella parte sinistra del canvas
    
    start = height/2 - (val*imageWidth+val*Distance);
    
    for(let n = 0; n < CarteN; n++) {
      x_ = width/12.5;
      y_ = start+n*imageWidth+n*Distance;
      StampaCarta(x_, y_, 15, 4); // Le carte sono nascoste, quindi viene stampato il retro
    }
    
  } else
  if(Giocatore == 2) { // Le carte vengono stampate nella parte superiore del canvas
    
    start = width/2 + (val*imageWidth+val*Distance);

    // Ogni carta viene stampata
    for(let n = 0; n < CarteN; n++) {
      x_ = start-n*imageWidth-n*Distance;
      y_ = height/7;
      StampaCarta(x_, y_, 15, 4);
    }
    
  } else
  if(Giocatore == 3) { // Le carte vengono stampate nella parte destra del canvas
    
    start = height/2 - (val*imageWidth+val*Distance);
    
    for(let n = 0; n < CarteN; n++) {
      x_ = width - width/12.5;
      y_ = start+n*imageWidth+n*Distance;
      StampaCarta(x_, y_, 15, 4);
    }
    
  } else return false; // Il numero massimo di giocatori è 4.
}

 /*******************************************
 *                                          *
 *  Imposta le dimensioni delle carte in,   *
 *  base alla loro dimensione rispetto al   *
 *  canvas, ovvero uno fratto RATIO, che    *
 *     è possibile modificare sopra         *
 *                                          *
 *******************************************/
function DimensioniCarta() {
  let ImageX = 240;
  let ImageY = 360;
  
  let ImageAspectRatio = ImageY/ImageX;
  
  imageWidth  = ImageX/(RATIO/(width/ImageX));
  imageHeight = imageWidth*ImageAspectRatio;
  
  
}
    

 /*******************************************
 *                                          *
 *  Prende una carta dal mazzo, la rimuove  *
 *  dall'array, poi la ritorna come valore  *
 *                                          *
 *******************************************/
function PescaCarta() {
  if( MazzoN == 0 ) return false;
  var index = int(random(0, MazzoN));
  var element = Mazzo[index];
  MazzoN--;
  Mazzo[index] = Mazzo[MazzoN];
  
  //print("Elementi Rimanenti nel Mazzo: " + MazzoN + "\nCarte Pescata: " + element.Valore + " - " + element.Colore + "\n");
  return element;
}


 /*******************************************
 *                                          *
 *        Stampa una carta a schermo        *
 *                                          *
 *******************************************/
function StampaCarta(x, y, Valore, Colore) {
  if(Valore >= 13 && Valore <= 16 && Colore == 4) {
    Valore -= 13;
  } else
  if(Valore < 0 || Valore > 12 ||
     Colore < 0 || Colore > 3) return false; 
  
  var img = Immagini[Colore][Valore];
  image(img,
        x,
        y,
        imageWidth,
        imageHeight
  );
}



 /*******************************************
 *                                          *
 *   Riempe la struttura dati di tutte      *
 * le carti presenti all'interno del gioco  *
 *                                          *
 *******************************************/
function InizializzaMazzo() {
  for (let i = 0; i < 4; i++) { // 4
      Mazzo.push( new Carta(0,i) );
      MazzoN++;
  }
  
  // Carte da 1 a 9, SaltaTurno, Reverse, +2. (12 Carte)
  for (let k = 0; k < 2; k++) { // Ci sono due carte uguali per ogni tipo
    for (let i = 1; i <= 12; i++) { // Le carte sono 12 tipi 
      for (let j = 0; j < 4; j++) { // I colori sono 4
        Mazzo.push( new Carta(i, j) );
        MazzoN++;
      }
    }
  }
    
  // CambioColore
  for(let i = 0; i < 4; i++) {
    Mazzo.push( new Carta(13, 4) );
    MazzoN++;
  }
   
  // +4
  for(let i = 0; i < 4; i++) {
    Mazzo.push( new Carta(14, 4) );
    MazzoN++;
  }
}

 /*******************************************
 *                                          *
 * Prima dell'inizio del gioco, compare il  *
 * menu, che permette di mostrare i crediti *
 *        e di iniziare a giocare           *
 *                                          *
 *******************************************/
function menu() {
  
  imageMode(CORNER);
  
  document.body.style.cursor = "default";

  image(imageMenu[0], 0, 0, width, height);

  //Proprieta' rettangolo 1
  let x1 = 0.29 * width;
  let y1 = height - 0.56 * height;
  let altezza1 = 0.094 * height;
  let larghezza1 = 0.2 * width;

  //Proprieta' rettangolo 2
  let x2 = 0.49 * width;
  let y2 = height - 0.51 * height;
  let altezza2 = 0.09 * height;
  let larghezza2 = 0.18 * width;

  //Controllo pressione tasto "Gioca"
  if (!statoCrediti) {

    if (mouseX >= x1 && mouseX <= x1 + larghezza1 &&
      mouseY >= y1 && mouseY <= y1 + altezza1) {

      document.body.style.cursor = "pointer";
      image(imageMenu[1], 0, 0, width, height);

      if(mouseIsPressed) {
      	menuMostrato = false;
      	document.body.style.cursor = "default";
      }
    }
  }

  //Controllo pressione tasto "Crediti"
  if (mouseX >= x2 && mouseX <= x2 + larghezza2 &&
    mouseY >= y2 && mouseY <= y2 + altezza2) {

  	document.body.style.cursor = "pointer";
    image(imageMenu[2], 0, 0, width, height);

    if (mouseIsPressed || statoCrediti)
      statoCrediti = true;
  }

  if (statoCrediti)
    crediti();
}

 /*******************************************
 *                                          *
 *        Stampa i crediti del gioco        *
 *                                          *
 *******************************************/
function crediti() {

  document.body.style.cursor = "default";

  // Assegnazione valori alle proprietà in relazione al popUp
  let x = (width * 0.8 - 0.11 * width * 0.8) + width * 0.1;
  let y = (height - (height * 0.8)) / 2;
  let larghezza = (width * 0.8 - x) + (width * 0.1);
  let altezza = 0.09 * height * 0.8;

  // Proprietà QR Code
  let xQR = 0.722*width;
  let yQR = height - 0.42*height;
  let LatoQR = 0.23*height; // Il QR Code è un Quadrato

  imageMode(CENTER);

  image(sfondoCrediti, width/2, height/2, width, height);

  imageMode(CORNER);

  if (mouseX >= x && mouseX <= x + larghezza && // Tasto X per chiudere i crediti
    mouseY >= y && mouseY <= y + altezza) {

    document.body.style.cursor = "pointer";
    
    if (mouseIsPressed) {
    	statoCrediti = false;
    }
    
  } else
  if((mouseX >= xQR && mouseX <= xQR + LatoQR) && // Apre il link del codice QR
  	 (mouseY >= yQR && mouseY <= yQR + LatoQR)) {

  	  document.body.style.cursor = "pointer";

      if(mouseIsPressed) {

      	// Apre il QR Code
      	window.open("https://github.com/ShaZeOfShiNy/Uno-Project");

      	mouseIsPressed = false; // Fixes a p5.js bug

      }

  }
}



 /*******************************************
 *                                          *
 *     Stampa il podio, la classifica.      *
 *      il mazzo di carte. Realizza         *
 *        per compattare il codice          *
 *                                          *
 *******************************************/
function classifica() {

  image(classificaImage[0], width/2, height/2, width, height);
  
  // Proprietà "Chiudi"
  let x1 = 0.13*width;
  let y1 = height - 0.18*height;
  let Altezza1 = 0.13*height;
  let Larghezza1 = 0.33*width;
  
  //Proprietà "Torna al Menu"
  let x2 = 0.32*width;
  let y2 = height - 0.36*height;
  let Altezza2 = 0.13*height;
  let Larghezza2 = 0.36*width;
  
  // Se il mouse è sul tasto Chiudi
  if(mouseX >= x1 && mouseX <= x1 + Larghezza1 &&
     mouseY >= y1 && mouseY <= y1 + Altezza1) {
    
    image(classificaImage[2], width/2, height/2, width, height);
    document.body.style.cursor = "pointer";
    

    if(mouseIsPressed) {
      
      window.close();
      
    }
    
  } else
  // Se il mouse è sul tasto Torna al Menu
  if(mouseX >= x2 && mouseX <= x2 + Larghezza2 &&
     mouseY >= y2 && mouseY <= y2 + Altezza2) {
    
    image(classificaImage[1], width/2, height/2, width, height);
    document.body.style.cursor = "pointer";
    

    if(mouseIsPressed) {
      
      //location.reload();
      InizializzaGioco();
   	  return;
    }
    
  } else document.body.style.cursor = "default";

  // Calcolo del punteggio
  if(punteggioCalcolato == false) {
  	punteggioCalcolato = true;
  	contaPunti();
  	SeleSort();
  	counterStampa = 0;
  }
  
  // Vengono stampate le scritte nella classifica
  textFont(fontClassifica); fill(255);
  textSize(width/30); textAlign(CENTER, CENTER);
  strokeWeight(5);

  //Variabili colori posizioni
  let coloreQuartoPosto = "#986a45";
  let coloreTerzoPosto = "#cd7f32";
  let coloreSecondoPosto = "#c0c0c0";
  let colorePrimoPosto = "#cda434";

  strokeWeight(int(0.0026042*width));stroke(0);

  if(counterStampa >= 90) {

  	let L = 0.16 * width;
  	let A = 0.11 * height;
  	let x = 0.613 * width;
  	let y = height - height*0.62;

  	// Stampa quarta posizione
  	fill(coloreQuartoPosto);
  	text(("P" + str(punteggio[0].pos+1)), x + L/2, y + A/2);

  }
  if(counterStampa >= 180) {

  	let L = 0.16 * width;
  	let A = 0.11 * height;
  	let x = 0.42 * width;
  	let y = height - height*0.62;

  	// Stampa terza posizione
  	fill(coloreTerzoPosto);
  	text(("P" + str(punteggio[1].pos+1)), x + L/2, y + A/2);
  	
  }
  if(counterStampa >= 270) {

  	let L = 0.16 * width;
  	let A = 0.11 * height;
  	let x = 0.227 * width;
  	let y = height - height*0.62

  	// Stampa seconda posizione
  	fill(coloreSecondoPosto);
  	text(("P" + str(punteggio[2].pos+1)), x + L/2, y + A/2);
  	
  }
  if(counterStampa >= 360) {

  	let L = 0.22 * width;
  	let A = 0.11 * height;
  	let x = 0.39 * width;
  	let y = height - height*0.80;

  	// Stampa prima posizione
  	fill(colorePrimoPosto);
  	text(("P" + str(punteggio[3].pos+1)), x + L/2, y + A/2);
  	
  	counterStampaIsOn = false;
  }

  if(counterStampaIsOn) counterStampa++;


}



 /*******************************************
 *                                          *
 * Funzione di ordinamento, tramite tecnica *
 *   SeleSort. Ordina lo struct punteggio   *
 *                                          *
 *******************************************/
function SeleSort() {

  let temp = {
  	val: 0,
  	pos: 0
  };
  let min;
  for(let i = 0; i < 4; i++)
  	print("Punteggio["+i+"]:{"+punteggio[i].val+","+punteggio[i].pos+"}");

  // --- Inizio Ordinamento ---
  for (let i = 0; i < NumeroGiocatori - 1; i++) {
    min = i;

    for(let j = i + 1; j < NumeroGiocatori; j++)
   	  if(punteggio[j].val < punteggio[min].val) {
      	min = j;
      }
     
    temp = punteggio[i];

    punteggio[i] = punteggio[min];
    
    punteggio[min] = temp;
    
  }

  punteggio.reverse();
  // --- Fine Ordinamento---
  /*
  for(let i = 0; i < 4; i++)
  	print("Punteggio["+i+"]:{"+punteggio[i].val+","+punteggio[i].pos+"}");


  // Scambia gli indici con .pos
  for(let i = 0; i < NumeroGiocatori; i++) {

  	while(punteggio[i].pos != i) {

      temp = punteggio[i]; let a = punteggio[i].pos;
      punteggio[i] = punteggio[ a ];
      punteggio[ a ] = temp;

      print(punteggio[i].pos + " - " + punteggio[a].pos);
  	}

  }

  for(let i = 0; i < 4; i++)
  	print("Punteggio["+i+"]:{"+punteggio[i].val+","+punteggio[i].pos+"}");
  */
}



 /*******************************************
 *                                          *
 * Calcola il punteggio che ogni giocatore  *
 *    ottiene, in base alle loro carte al   *
 *        termine della partita             *
 *                                          *
 *******************************************/
function contaPunti() {

  for (let i = 0; i < 4; i++) {

  	punteggio[i] = {
  		pos: i,
  		val: 0
  	}
  	//punteggio.push({pos: i, val: 0});
    
    for (let j = 0; j < carteGiocatoriN[i]; j++) {

      //Valore carte " 4" e "Cambio colore" = 50
      if (carteGiocatori[i][j].Valore == 13 || carteGiocatori[i][j].Valore == 14) {
        punteggio[i].val += 50;
        punteggio[i].pos = i;
      } else
      //Valore carte "Cambio giro", "Stop" e " 2" = 20
      if (carteGiocatori[i][j].Valore >= 10 && carteGiocatori[i][j].Valore <= 12) {
        punteggio[i].val += 20;
    	punteggio[i].pos = i;
      } else {
        //Valore carte normali
        punteggio[i].val += carteGiocatori[i][j].Valore;
        punteggio[i].pos = i;
  	  }
    }
  }
}



 /*******************************************
 *                                          *
 * Viene utilizzata solamente per riempire  *
 *      il mazzo di carte. Realizzata       *
 *        per compattare il codice          *
 *                                          *
 *******************************************/
class Carta {
  constructor (_Valore, _Colore) {
    this.Valore = _Valore;
    this.Colore = _Colore;
  }
}
