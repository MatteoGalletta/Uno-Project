/*
 * UNO REMAKE
 *
 * Made by: Matteo Galletta, Flavio Carpinteri, Kevin Speranza
 * on day: 01/09/2020
 * using library: p5.js
 * at website: https://www.p5js.org
 * 
 * JavaScript & p5js learnt by: Daniel Shiffman
 *   a.k.a. The Coding Train
 *     @ https://www.youtube.com/c/TheCodingTrain
 * 
 * UNO Rules took from: https://www.officialgamerules.org/uno
 *
 * Software Version: v1.0a
 *
 */


/* Dimensioni della carta rispetto al canvas.
 *  Più RATIO è alto, più le dimensioni delle
 *  carte saranno inferiori.
 *  Esempio:
 *  RATIO = 5 -> Le carte occuperanno un quinto dello schermo (1/5)
 * è suggerito lasciare questo valore invariato.
 */
const RATIO = 13;
const NumeroGiocatori = 4; // non modificare

var Mazzo = []; // Contiene tutte le carte del mazzo da cui verranno pescate le carte
var MazzoN; // Conta il numero di carte presenti all'interno del mazzo
var ContaFrame; // Conta il numero dei frame, utilizzato per funzioni di Animazioni. (Pausa)
var TurnoAttuale; // Indica il giocatore a cui tocca effettuare la mossa
var ColoreAttuale; // Indica il colore attuale
var cardsToGive; // Flag che indica se assegnare le carte ai giocatori
var canClick; // Flag che indica se il giocatore ha il permesso di cliccare
var botHasPlayed; // Flag che indica se il bot in quel turno ha giocato
var mustChooseColor; // Flag che indica se il giocatore deve scegliere un colore
var sensoOrario; // Flag che indica se il senso è orario o antiorario
var mustClickUno; // Flag che indica se il player deve o meno cliccare Uno
var UnoCount; // Serve a far partire un timer per il tasto Uno
var statoCrediti; // Flag per gestire l'apertura del popup "crediti"
var menuIsShown; // Flag che rappresenta la presenza/assenza del menu
var gameEnded; // Flag che indica la fine del gioco
var punteggioCalcolato; // Flag che indica se il punteggio è stato calcolato o meno
var counterStampaIsOn; // Flag che indica se il counterStampa è attivo
let punteggio; // Contiene il punteggio dei giocatori
let counterStampa; // Serve a stampare la classifica con un delay
  
var ImageWidth; // Larghezza di ogni carta
var ImageHeight; // Altezza di ogni carta

var CarteGiocatori = [ // Contiene le carte dei giocatori
  [], // Giocatore 1 [Bottom]
  [], // Giocatore 2 [Left]
  [], // Giocatore 3 [Top]
  []  // Giocatore 4 [Right]
];
var CarteGiocatoriN = []; // Conserva il numero di carte che ogni giocatore ha

var CartaTerra = { // Rappresenta la carta a terra
  Valore: 0,
  Colore: 0
};


var Immagini = [ // Conserva le immagini di tutte le carte
  [], // Blue 
  [], // Green
  [], // Red
  [], // Yellow
  []  // Gray
];
var wallpapers = []; // Conserva gli sfondi, che cambiano in base al colore attuale
var senso = []; // Conserva le immagini delle frecce che indicano il giro attuale
var imageMenu = []; // Conserva le immagini inerenti al menu
var classificaImage = []; // Conserva le immagini per la classifica finale
var sfondoCrediti; // Conserva l'immagine sfondo dei crediti
var fontClassifica;


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
  createCanvas(window.innerWidth, window.innerWidth/1.78);
  //createCanvas(960, 540);
  //createCanvas(1920,1080);
  fullscreen(true);
  frameRate(60);
  InizializzazioneGame();
  gameEnded = true; // to remove
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
function InizializzazioneGame() {
  ContaFrame = 0;
  imageMode(CENTER);
  angleMode(DEGREES);
  MazzoN = 0; InizializzaMazzo();
  CartaTerra = PescaCarta();
  sensoOrario = true;
  mustClickUno = false;
  UnoCount = 0; ContaFrame = 0;
  statoCrediti = false;
  menuIsShown = true;
  gameEnded = false;
  punteggioCalcolato = false;

  counterStampaIsOn = true;
  
  for(let i = 0; i < 4; i++) {
    CarteGiocatoriN[i] = 0;
  }
  
  if(CartaTerra.Colore != 4) {
    ColoreAttuale = CartaTerra.Colore;
    mustChooseColor = false;
  }
  else {
    ColoreAttuale = 4;
    mustChooseColor = true;
  }
  
  DimensioniCarta();
  TurnoAttuale = 0; // Inizia il giocatore 0
  cardsToGive = true;
  canClick = false;
  
  for(let n = 0; n < NumeroGiocatori; n++)
    CarteGiocatoriN[n] = 0;
  
  
}

 /*******************************************
 *                                          *
 *  Viene ripetuto in loop, renderizza al   *
 *    termine e stampa tutto il canvas      *
 *                                          *
 *******************************************/
function draw() {
  
  resizeCanvas(window.innerWidth, window.innerWidth/1.78);
  DimensioniCarta();
  
  // Se il flag gameEnded è vero, la classifica viene mostrata
  if(gameEnded) {
    classifica();
    return;
  }
  // Se il flag menuIsShown è vero, il menu viene mostrato
  if(menuIsShown) {
    menu();
    return;
  }
  
  imageMode(CENTER);
  
  // Stampa la prima carta, che viene disposta al centro del canvas.
  image(wallpapers[ColoreAttuale], width/2, height/2, width, height);
  
  image(senso[(sensoOrario?1:0)], width/2, height/2, senso[(sensoOrario?1:0)].width/(1920/width), senso[(sensoOrario?1:0)].height/(1080/height));
  
  // Stampa la carta che rappresenta il mazzo
  if(MazzoN > 0)
    StampaCarta(width/2 - ImageWidth/1.15, height/2, 15, 4);
  
  // Stampa la carta a terra, quindi l'ultima buttata
  StampaCarta(width/2 + ImageWidth/1.15, height/2, CartaTerra.Valore, CartaTerra.Colore);
  
  // Se la condizione è vera, le carte non devono più essere distribuite
  if(cardsToGive && CarteGiocatoriN[NumeroGiocatori - 1] == 7) {
    cardsToGive = false;
    TurnoAttuale = 0;
    canClick = true;
  }
  
  if(ContaFrame == 10 && cardsToGive) { // Vengono distribuite 6 carte al secondo (60/10)
    ContaFrame = 0;
    CarteGiocatori[TurnoAttuale][CarteGiocatoriN[TurnoAttuale]] = PescaCarta();
    CarteGiocatoriN[TurnoAttuale]++;
    
    TurnoAttuale = GiocatoreSuccessivo(TurnoAttuale);
    
  }
  
  if(cardsToGive == false) {
  	
  	let n = CarteGiocatoriN[TurnoAttuale];
  	stroke(255, 255, 255);
  	strokeWeight(5);
  	fill(255,255,255,40)
  	rectMode(CENTER);
  		

  	if(TurnoAttuale == 0 || TurnoAttuale == 2) {
  		
  		let Larghezza = (n/2 + 1)*ImageWidth;
  		let Altezza = 1.25*ImageHeight;

  		let y = (TurnoAttuale == 0) ? (height-height/7) : height/7;
  		rect(width/2, y, Larghezza, Altezza, ImageHeight/5);

  	} else
  	if(TurnoAttuale == 1 || TurnoAttuale == 3) {
  		let Larghezza = ImageWidth*1.25;
  		let Altezza = (n/3 + 1)*ImageHeight;

  		let x = ((TurnoAttuale == 1) ? width/12.5 : (width - width/12.5));
  		rect(x, height/2, Larghezza, Altezza, ImageHeight/5);
  	}
  }

  for(let n = 0; n < NumeroGiocatori; n++) {
    StampaMazzo(n);
  }
  
  // --- INIZIO GIOCO ---
  
  if(ContaFrame == 90 && mustChooseColor == false) { // Tra un bot e l'altro, passano 120 frames
    
    if(TurnoAttuale != 0)  
      TurnoBot(TurnoAttuale);

  }
  
  if(mustClickUno == true) {
    UnoCount++;
  }
  
  if(UnoCount == 150) {
    mustClickUno = false;
    UnoCount = 0;
    
    CarteGiocatori[0][CarteGiocatoriN[0]++] = PescaCarta();
    CarteGiocatori[0][CarteGiocatoriN[0]++] = PescaCarta();
    
  }
  
  if(MazzoN == 0) gameEnded = true;

  // Timer: 90 frame -> Un secondo e mezzo
  if(ContaFrame == 90) ContaFrame = 0;
  else ContaFrame++;
}

 /*******************************************
 *                                          *
 * Gestisce il funzionamento del tasto uno  *
 *                                          *
 *******************************************/
function mouseClicked() {
  if(mouseX >= width/2 - ImageWidth/4 &&
     mouseX <= width/2 + ImageWidth/4 &&
     mouseY >= height/2 - ImageHeight/3 &&
     mouseY <= height/2 + ImageHeight/3) {
     
    if(mustClickUno == true) {
      mustClickUno = false;
      UnoCount = 0;
    }
    else {
      UnoCount = 150;
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
  
  if(menuIsShown) return;
  
  if(mustChooseColor) {
    
    let centerX = width/2;
    let centerY = height/2;
    
    // Coordinate corrispondenti all'angolo in alto a sinistra dei pulsanti
    
    // Se il mouse tocca il pulsante...
    if(mouseX >= centerX - (width/34 + ImageWidth + width/128) &&
       mouseX <= centerX + (width/34 + ImageWidth + width/128) &&
       mouseY >= centerY - (ImageHeight/2 + width/35) &&
       mouseY <= centerY - (ImageHeight/2 + width/128)) { //...Blu (Sopra)
      ColoreAttuale = 0;
    } else
    if(mouseX >= centerX - (width/34 + ImageWidth + width/128) &&
       mouseX <= centerX + (width/34 + ImageWidth + width/128) &&
       mouseY >= centerY + (ImageHeight/2 + width/128) &&
       mouseY <= centerY + (ImageHeight/2 + width/35)){ //...Verde (Sotto)
      ColoreAttuale = 1;
    } else
    if(mouseX >= centerX - (width/34 + ImageWidth + width/35) &&
       mouseX <= centerX - (width/34 + ImageWidth + width/128)&&
       mouseY >= centerY - (ImageHeight/2) &&
       mouseY <= centerY + (ImageHeight/2)) { //...Rosso (Sinistra)
      ColoreAttuale = 2;
    } else
    if(mouseX >= centerX + (width/34 + ImageWidth + width/128) &&
       mouseX <= centerX + (width/34 + ImageWidth + width/35)&&
       mouseY >= centerY - (ImageHeight/2) &&
       mouseY <= centerY + (ImageHeight/2)) { //...Giallo (Destra)
      ColoreAttuale = 3;
    }
    if(ColoreAttuale != 4) {
      mustChooseColor = false;
      //TurnoAttuale = GiocatoreSuccessivo(TurnoAttuale);
    }
    return;
  }
  
  //if(canClick == false) return false;
  if(TurnoAttuale != 0) return false;
  
  // Coordinate centrali della carta del mazzo
  let xMazzo = width/2 - ImageWidth/1.15;
  let yMazzo = height/2;
  
  // Controllo per prendere una carta dal mazzo
  if((mouseX >= xMazzo - ImageWidth/2) &&
     (mouseX <= xMazzo + ImageWidth/2) &&
     (mouseY >= yMazzo - ImageWidth/2) &&
     (mouseY <= yMazzo + ImageWidth/2)) {
     
     CarteGiocatori[0][CarteGiocatoriN[0]] = PescaCarta();
     CarteGiocatoriN[0]++;
     TurnoAttuale = GiocatoreSuccessivo(TurnoAttuale);
  }
  
  // Controllo per l'ultima carta, con area quindi doppia
  if((mouseX >= CarteGiocatori[0][CarteGiocatoriN[0]-1].X - ImageWidth/2) &&
     (mouseX <= CarteGiocatori[0][CarteGiocatoriN[0]-1].X + ImageWidth/2) &&
     (mouseY >= CarteGiocatori[0][CarteGiocatoriN[0]-1].Y - ImageHeight/2) &&
     (mouseY <= CarteGiocatori[0][CarteGiocatoriN[0]-1].Y + ImageHeight/2)) {
    let bef = CarteGiocatori[0][CarteGiocatoriN[0]-1];
    GettaCarta(0,CarteGiocatoriN[0]-1);
    let aft = CarteGiocatori[0][CarteGiocatoriN[0]-1];
    if(bef != aft)
      TurnoAttuale = GiocatoreSuccessivo(TurnoAttuale);
  }
  // Controllo per tutte le carte, esclusa l'ultima
  for(let n = 0; n < CarteGiocatoriN[0]; n++) {
    
    // Controlla se il mouse abbia cliccato una carta
    if((mouseX >= CarteGiocatori[0][n].X - ImageWidth/2) &&
       (mouseX <= CarteGiocatori[0][n].X ) &&
       (mouseY >= CarteGiocatori[0][n].Y - ImageHeight/2) &&
       (mouseY <= CarteGiocatori[0][n].Y + ImageHeight/2)) {
      
      if(CarteGiocatori[0][n].Colore == 4) {
        mustChooseColor = true;
      }
      
      // Se si clicca su una carta che non è possibile
      // buttare, il turno non viene sprecato.
      let bef = CarteGiocatori[0][n];
      GettaCarta(0, n);
      let aft = CarteGiocatori[0][n];
      if(bef != aft)
        TurnoAttuale = GiocatoreSuccessivo(TurnoAttuale);

    
    }
    
  }
  ContaFrame = 0;
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
  let Carte = CarteGiocatori[Giocatore];
  let N = CarteGiocatoriN[Giocatore];
  
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
    if((Carta.Valore == CartaTerra.Valore || // HANNO VALORE DIVERSO
        Carta.Colore == ColoreAttuale || // HANNO COLORE UGUALE
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
    CarteGiocatori[Giocatore][CarteGiocatoriN[Giocatore]] = PescaCarta();
    CarteGiocatoriN[Giocatore]++;
  }
  TurnoAttuale = GiocatoreSuccessivo(TurnoAttuale);
  
  
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
  
  let CartaDaButtare = CarteGiocatori[Giocatore][index];
  
  if(CartaDaButtare.Valore != CartaTerra.Valore &&
     CartaDaButtare.Colore != ColoreAttuale){
    
    if(CartaDaButtare.Colore == 4) isGray = true;
    else return false; 
  }
  
  
  if(CartaDaButtare.Valore == CartaTerra.Valore ||
     CartaDaButtare.Colore == ColoreAttuale ||
     isGray) {
    
    CartaTerra.Valore = CarteGiocatori[Giocatore][index].Valore; // debug1
    CartaTerra.Colore = CarteGiocatori[Giocatore][index].Colore;
    
    if(CarteGiocatori[Giocatore][index].Colore != 4) {
      ColoreAttuale = CartaTerra.Colore;      
    }
    else {
      if(Giocatore == 0) {
        ColoreAttuale = 4;
        mustChooseColor = true;
      }
      else {
        ColoreAttuale = ColoreBOT;
      }
    }
    
    
    CarteGiocatori[Giocatore][index] =
      CarteGiocatori[Giocatore][--CarteGiocatoriN[Giocatore]];
    
  }
  
  if(CartaTerra.Valore == 10) {
      TurnoAttuale = GiocatoreSuccessivo(TurnoAttuale);
  } else
  if(CartaTerra.Valore == 11) {
    sensoOrario = !sensoOrario;
  } else
  if(CartaTerra.Valore == 12) {
    let x = GiocatoreSuccessivo(TurnoAttuale);
    CarteGiocatori[x][CarteGiocatoriN[x]++] = PescaCarta();
    CarteGiocatori[x][CarteGiocatoriN[x]++] = PescaCarta();
    TurnoAttuale = x;
  } else
  if(CartaTerra.Valore == 14) {
    let x = GiocatoreSuccessivo(TurnoAttuale);
    for(let n = 0; n < 4; n++) {
      CarteGiocatori[x][CarteGiocatoriN[x]++] = PescaCarta();
    }
    TurnoAttuale = x;
  }
  
  if(CarteGiocatoriN[Giocatore] == 0) {
    gameEnded = true;
  }
  
  if(Giocatore == 0 && CarteGiocatoriN[Giocatore] == 1) {
    mustClickUno = true;
  }
  
  
}



 /*******************************************
 *                                          *
 * Passato come valore il giocatore scelto, *
 * ne stampa sul lato appropriato il mazzo  *
 *                                          *
 *******************************************/
function StampaMazzo(Giocatore) {
  let Carte = CarteGiocatori[Giocatore];
  let CarteN = CarteGiocatoriN[Giocatore]
  
  let Distance = -ImageHeight/3;
  let val = (CarteN - 1)/2;
  var start;  
  var x_, y_;
  if(Giocatore == 0) { // Le carte vengono stampate nella parte inferiore del canvas
    
    // Posizione iniziale per stampare le carte perfettamente al centro
    let start = width/2 - (val*ImageWidth+val*Distance);

    // Ogni carta viene stampata
    for(let n = 0; n < CarteN; n++) {
      x_ = start+n*ImageWidth+n*Distance;
      y_ = height-height/7;
      
      // Salva le coordinate delle carte appena piazzate
      CarteGiocatori[0][n].X = x_;
      CarteGiocatori[0][n].Y = y_;
      
      // Stampa la carta
      StampaCarta(x_, y_, Carte[n].Valore, Carte[n].Colore);
    }
    
    
  } else
  if(Giocatore == 1) { // Le carte vengono stampate nella parte sinistra del canvas
    
    start = height/2 - (val*ImageWidth+val*Distance);
    
    for(let n = 0; n < CarteN; n++) {
      x_ = width/12.5;
      y_ = start+n*ImageWidth+n*Distance;
      StampaCarta(x_, y_, 15, 4); // Le carte sono nascoste, quindi viene stampato il retro
    }
    
  } else
  if(Giocatore == 2) { // Le carte vengono stampate nella parte superiore del canvas
    
    start = width/2 + (val*ImageWidth+val*Distance);

    // Ogni carta viene stampata
    for(let n = 0; n < CarteN; n++) {
      x_ = start-n*ImageWidth-n*Distance;
      y_ = height/7;
      StampaCarta(x_, y_, 15, 4);
    }
    
  } else
  if(Giocatore == 3) { // Le carte vengono stampate nella parte destra del canvas
    
    start = height/2 - (val*ImageWidth+val*Distance);
    
    for(let n = 0; n < CarteN; n++) {
      x_ = width - width/12.5;
      y_ = start+n*ImageWidth+n*Distance;
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
  
  ImageWidth  = ImageX/(RATIO/(width/ImageX));
  ImageHeight = ImageWidth*ImageAspectRatio;
  
  
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
        ImageWidth,
        ImageHeight
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
      	menuIsShown = false;
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
      cursor();
      InizializzazioneGame();
    
    }
    
  } else document.body.style.cursor = "default";

  // Calcolo del punteggio
  if(punteggioCalcolato == false) {
  	punteggioCalcolato = true;
  	punteggio = contaPunti();
  	SeleSort(punteggio);
  	counterStampa = 0;
  }
  
  // Vengono stampate le scritte nella classifica
  textFont(fontClassifica); fill(255);
  textSize(width/30); textAlign(CENTER, CENTER);
  strokeWeight(5);

  if(counterStampa >= 120) {
	
  	stroke(100);

  	let L = 0.16 * width;
  	let A = 0.11 * height;
  	let x = 0.613 * width;
  	let y = height - height*0.62;

  	//text("P1", x + L/2, y + A/2);
  	text(("P" + str(punteggio[0].pos+1)), x + L/2, y + A/2);
  	print(("P" + str(punteggio[0].pos)));

  }
  if(counterStampa >= 240) {

  	let L = 0.16 * width;
  	let A = 0.11 * height;
  	let x = 0.42 * width;
  	let y = height - height*0.62;

  	//text("P2",x + L/2, y + A/2);
  	text(("P" + str(punteggio[1].pos+1)), x + L/2, y + A/2);
  	print(("P" + str(punteggio[1].pos)));

  }
  if(counterStampa >= 360) {

  	let L = 0.16 * width;
  	let A = 0.11 * height;
  	let x = 0.227 * width;
  	let y = height - height*0.62

  	//text("P3", x + L/2, y + A/2);
  	text(("P" + str(punteggio[2].pos+1)), x + L/2, y + A/2);
  	print(("P" + str(punteggio[2].pos)));

  }
  if(counterStampa >= 480) {

  	// Stampa P* per Vincitore
  	let L = 0.22 * width;
  	let A = 0.11 * height;
  	let x = 0.39 * width;
  	let y = height - height*0.80;

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
function SeleSort(a) {

  let min, temp;

  let i, j;
  
  for (i = 0; i < NumeroGiocatori - 1; i++) {
    min = i;

    for (j = i + 1; j < NumeroGiocatori; j++)
      if (a[j].val < a[min].val)
        min = j;

    temp = a[min];
    a[min] = a[i];
    a[i] = temp;
  }
}



 /*******************************************
 *                                          *
 * Calcola il punteggio che ogni giocatore  *
 *    ottiene, in base alle loro carte al   *
 *        termine della partita             *
 *                                          *
 *******************************************/
function contaPunti() {

  let punteggio = [];

  for (let i = 0; i < 4; i++) {

  	punteggio.push({pos: i, val: 0});
    
    for (let j = 0; j < CarteGiocatoriN[i]; j  ) {

      //Valore carte " 4" e "Cambio colore" = 50
      if (CarteGiocatori[i][j].Valore == 13 || CarteGiocatori[i][j].Valore == 14)
        punteggio[i].val = 50;
      //Valore carte "Cambio giro", "Stop" e " 2" = 20
      else if (CarteGiocatori[i][j].Valore >= 10 || CarteGiocatori[i][j].Valore <= 12)
        punteggio[i].val = 20;
      //Valore carte normali
      else punteggio[i].val  = CarteGiocatori[i][j].Valore;
    }
  }

  return punteggio;
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
