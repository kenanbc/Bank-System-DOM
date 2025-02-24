//GLOBALNE VARIJABLE ZA FORMATIRANJE ISPISA
const red = '\x1b[35m';;
const green = '\x1b[32m';
const blue = '\x1b[36m';
const yellow = '\x1b[33m';
const white = '\x1b[0m';
const bold = '\x1b[1m';
const nonBold = '\x1b[0m';

function ispisLinija(broj = 50) {  
    for(let i = 0; i < broj; i++)
        process.stdout.write("-");

    console.log();
}
ispisLinija(80);
console.log(`\t\t\t${bold}${yellow}NAJBOLJA BANKOVNA APLIKACIJA${nonBold}${white}`);
ispisLinija(80);

//****************************************************************

class Banka{
    adresa;
    static racuni = [];

    constructor(adresa){
        this.adresa = adresa;
    }
 
    static prikaziRacune(){
        ispisLinija(80);
        console.log(`\t\t\t${bold}Lista kreiranih racuna${nonBold}\n`);
        Banka.racuni.forEach((e) => console.log(`Ime vlasnika: ${yellow}${e.imeVlasnika}${white} Tip racuna: ${blue}${e.tipRacuna}${white} Broj racuna: ${yellow}${e.getBrojRacuna}${white}`));
    }

    static dodajRacun(racun){
        Banka.racuni.push(racun);
    }


    static nePostojiRacun(brojRacuna){
        return !Banka.racuni.find((e) => e.getBrojRacuna === brojRacuna);
    }

    static nadjiRacun(brojRacuna){
       return Banka.racuni.find((e) => e.getBrojRacuna === brojRacuna);
    }

    static uplataNaRacun(sourceRacun, targetRacun, iznos){
        ispisLinija(80);
        let srcRacun = Banka.nadjiRacun(sourceRacun);

        if(iznos < 0) {
            console.log(`${red}Unesen negativan iznos!${white}`);
            return;
        }
        else if(Banka.nePostojiRacun(targetRacun) || Banka.nePostojiRacun(sourceRacun) || targetRacun === sourceRacun){
            console.log(`${red}Unijeli ste pogresan broj racuna!${white}`);
            return;
        }
        else if(!Banka.provjeraTipaRacuna(sourceRacun) || !Banka.provjeraTipaRacuna(targetRacun)){
            console.log(`${red}Nemoguce izvrsiti transakciju. Pogresan tip racuna! ${white}`); 
            return;
        }
        else if(iznos > srcRacun.getIznosNaRacunu){
            console.log(`${red}Nemate dovoljno sredstava na racunu!${white}`);
            return;
        }
        else if(Banka.izvrsiTransakciju(targetRacun, iznos)){
            srcRacun.setIznosNaRacunu = srcRacun.getIznosNaRacunu - iznos;
            console.log(`${green}Uspjesno ste izvrsili uplatu na racun: ${blue} ${targetRacun} ${green} u iznosu od ${yellow} ${iznos}${green}KM.` + white); 
        }
        else
            console.log(`${red}Doslo je do problema sa izvodenjem transakcije! Pokusajte ponovo!${white}`);

    }

    static izvrsiTransakciju(brojRacuna, iznos){
        let racun = Banka.racuni.find((e) => e.getBrojRacuna === brojRacuna);
        if(racun){
            racun.setIznosNaRacunu = racun.getIznosNaRacunu + iznos;
            return true;
        }
        return false;
    }

    static provjeraTipaRacuna(brojRacuna){
        return Banka.racuni.find((e) => e.tipRacuna.toLowerCase() === 'checking' && e.getBrojRacuna === brojRacuna);
    }

}


class Racun{
    imeVlasnika;
    #brojRacuna;
    #iznosNaRacunu;

    constructor(imeVlasnika, iznosNaRacunu){
        this.imeVlasnika = imeVlasnika;
        this.#brojRacuna = this.#generisiBrojRacuna();
        this.#iznosNaRacunu = iznosNaRacunu;
    }


    prikaziStanjeRacuna(){
        ispisLinija(80);
        console.log(`${blue}\tPrikaz stanja na racunu${white}`);
        console.log(`Ime: ${green}${this.imeVlasnika} ${white}`);
        console.log(`Stanje:${green} ${this.getIznosNaRacunu}${white}`);
    }

    #generisiBrojRacuna(){
        let brojRacuna = '';
        let pom = 0;
            while(brojRacuna.length < 16){
                pom = parseInt(Math.random() * 10);
                brojRacuna = brojRacuna + pom;
                if(brojRacuna.length === 16 && !Banka.nePostojiRacun(brojRacuna))
                    brojRacuna = '';
            }
        return brojRacuna;  
    }

    get getIznosNaRacunu(){
        return this.#iznosNaRacunu;
    }

    get getBrojRacuna(){
        return this.#brojRacuna;
    }

    set setIznosNaRacunu(iznos){
        this.#iznosNaRacunu = iznos;
    }

    povuciNovac(iznos){
        ispisLinija(80);
        console.log(`${blue}\t\t\t\tPodizanje novca${white}`);
        ispisLinija(80);
        if(iznos <= this.getIznosNaRacunu){
            console.log(`${green}Vasa transakcija se obradjuje. Molimo sacekajte!`);
            for(let i = 0; i < 4; i++) console.log("\t\t\t.");
            this.setIznosNaRacunu = this.getIznosNaRacunu - iznos;
            console.log(`${green}\t\tTransakcija zavrsena!${white}\n\t\tIsplaceno: (${iznos}KM)`);
            this.prikaziStanjeRacuna();
        }
        else
            console.log(`${red}Nemate dovoljno sredstava na racunu!${white}`);
    }

    depozitNovca(iznos){
        ispisLinija(80);
        if(iznos > 0){
            console.log(`${green}Vasa transakcija depozita novca (${iznos}KM) se obradjuje. Molimo sacekajte!`);
            for(let i = 0; i < 4; i++) console.log("\t\t\t.");
            this.setIznosNaRacunu = this.getIznosNaRacunu + iznos;
            console.log(`${green}\t\tDepozit novca zavrsen!${white}`);
            this.prikaziStanjeRacuna();
        }
        else
            console.log(`${red}Nije moguce izvrsiti depozit sa negativnim iznosom!${white}`);
    }
};


class CheckingRacun extends Racun{

    constructor(imeVlasnika, iznosNaRacunu){
        super(imeVlasnika, iznosNaRacunu);
        this.tipRacuna = 'Checking';;
        Banka.dodajRacun(this);
        console.log(`${green}Uspjesno ste kreirali${blue} ${this.tipRacuna} ${green}racun na ime ${imeVlasnika}!${white}`);
    }

    static kreirajCheckingRacun(imeVlasnika, iznosNaRacunu){
        if(iznosNaRacunu < 0){
           console.log(`${red}Nije dozvoljeno kreiranje racuna sa negativnim iznosom!${white}`);
           return;
        }
        return new CheckingRacun(imeVlasnika, iznosNaRacunu);
    }
};

class SavingsRacun extends Racun{

    constructor(imeVlasnika, iznosNaRacunu){
        super(imeVlasnika, iznosNaRacunu);
        this.tipRacuna = 'Savings';;
        Banka.dodajRacun(this);
        console.log(`${green}Uspjesno ste kreirali${blue} ${this.tipRacuna} ${green}racun na ime ${imeVlasnika}!${white}`);
    }

    static kreirajSavingsRacun(imeVlasnika, iznosNaRacunu){
        if(iznosNaRacunu < 0){
           console.log(`${red}Nije dozvoljeno kreiranje racuna sa negativnim iznosom!${white}`);
           return;
        }
        return new SavingsRacun(imeVlasnika, iznosNaRacunu);
    }
};


const banka = new Banka('Mese Selimovica 1');

const korisnik1 = CheckingRacun.kreirajCheckingRacun('Mujo Mujic', 700);
const korisnik2 = CheckingRacun.kreirajCheckingRacun('Niko Nikic', 500);
const korisnik3 = CheckingRacun.kreirajCheckingRacun('Ane Kane', -500);
const korisnik4 = SavingsRacun.kreirajSavingsRacun('Ricko Kanic', 0);

korisnik1.prikaziStanjeRacuna();

Banka.uplataNaRacun(korisnik1.getBrojRacuna, korisnik2.getBrojRacuna, 400);
Banka.uplataNaRacun(korisnik1.getBrojRacuna, korisnik4.getBrojRacuna, 200);

korisnik2.povuciNovac(50);

korisnik1.povuciNovac(20);

Banka.prikaziRacune();
