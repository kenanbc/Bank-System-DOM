class Banka{
    adresa;
    racuni = [];

    constructor(adresa){
        this.adresa = adresa;
    }
 
    dodajRacun(racun){
        this.racuni.push(racun);
    }

    nePostojiRacun(brojRacuna){
        return !this.racuni.find((e) => e.getBrojRacuna === brojRacuna);
    }

    nadjiRacun(brojRacuna){
       return this.racuni.find((e) => e.getBrojRacuna === brojRacuna);
    }

    uplataNaRacun(sourceRacun, targetRacun, iznos){
        let srcRacun = this.nadjiRacun(sourceRacun);

        if(iznos < 0) 
            return `Unesen negativan iznos!`;

        else if(this.nePostojiRacun(targetRacun) || this.nePostojiRacun(sourceRacun) || targetRacun === sourceRacun)
            return `Unijeli ste pogresan broj racuna!`;
        
        else if(!this.provjeraTipaRacuna(sourceRacun) || !this.provjeraTipaRacuna(targetRacun))
            return `Nemoguce izvrsiti transakciju. Pogresan tip racuna!`;

        else if(iznos > srcRacun.getIznosNaRacunu){
            return `Nemate dovoljno sredstava na racunu!`;
        }
        else if(this.izvrsiTransakciju(targetRacun, iznos)){
            srcRacun.setIznosNaRacunu = srcRacun.getIznosNaRacunu - iznos;
            return `Uspjesno ste izvrsili uplatu na racun`; 
        }
        else
           return `Doslo je do problema sa izvodenjem transakcije! Pokusajte ponovo!`;

    }

    izvrsiTransakciju(brojRacuna, iznos){
        let racun = this.racuni.find((e) => e.getBrojRacuna === brojRacuna);
        if(racun){
            racun.setIznosNaRacunu = racun.getIznosNaRacunu + iznos;
            return true;
        }
        return false;
    }

    provjeraTipaRacuna(brojRacuna){
        return this.racuni.find((e) => e.tipRacuna.toLowerCase() === 'checking' && e.getBrojRacuna === brojRacuna);
    }

}

class Racun{
    imeVlasnika;
    username;
    password;
    #brojRacuna;
    #iznosNaRacunu;

    constructor(imeVlasnika, iznosNaRacunu, username, password, banka){
        this.imeVlasnika = imeVlasnika;
        this.username = username;
        this.password = password;
        this.#brojRacuna = this.#generisiBrojRacuna(banka);
        this.#iznosNaRacunu = iznosNaRacunu;
    }

    #generisiBrojRacuna(banka){
        let brojRacuna = '';
        let pom = 0;
            while(brojRacuna.length < 16){
                pom = parseInt(Math.random() * 10);
                brojRacuna = brojRacuna + pom;
                if(brojRacuna.length === 16 && !banka.nePostojiRacun(brojRacuna))
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
        if(iznos <= this.getIznosNaRacunu){
            this.setIznosNaRacunu = this.getIznosNaRacunu - iznos;
            return;
        }
        else
            return `Nemate dovoljno sredstava na racunu!`;
    }

    depozitNovca(iznos){
        if(iznos > 0){
            this.setIznosNaRacunu = this.getIznosNaRacunu + iznos;
        }
        else
           return `Nije moguce izvrsiti depozit sa negativnim iznosom!`;
    }
};

class CheckingRacun extends Racun {
    constructor(imeVlasnika, iznosNaRacunu, username, password, banka) {
        super(imeVlasnika, iznosNaRacunu, username, password, banka);
        this.tipRacuna = 'Checking';
        banka.dodajRacun(this);
    }

    static kreirajCheckingRacun(imeVlasnika, iznosNaRacunu, username, password, banka) {
        if (iznosNaRacunu < 0)
            return `Nije dozvoljeno kreiranje racuna sa negativnim iznosom!`;

        return new CheckingRacun(imeVlasnika, iznosNaRacunu, username, password, banka);
    }
}

class SavingsRacun extends Racun{

    constructor(imeVlasnika, iznosNaRacunu, username, password, banka){
        super(imeVlasnika, iznosNaRacunu, username, password, banka);
        this.tipRacuna = 'Savings';;
        banka.dodajRacun(this);
    }

    static kreirajSavingsRacun(imeVlasnika, iznosNaRacunu, username, password, banka){
        if(iznosNaRacunu < 0)
            return `Nije dozvoljeno kreiranje racuna sa negativnim iznosom!`;
        
        return new SavingsRacun(imeVlasnika, iznosNaRacunu, username, password, banka);
    }
};


const banka = new Banka('Mese Selimovica 1');

const korisnik1 = CheckingRacun.kreirajCheckingRacun('Mujo Mujic', 700, 'mujo123', 'pass123', banka);
const korisnik2 = CheckingRacun.kreirajCheckingRacun('Niko Nikic', 500, 'niko456', 'pass456', banka);
const korisnik3 = CheckingRacun.kreirajCheckingRacun('Ane Kane', -500, 'ane789', 'pass789', banka);
const korisnik4 = SavingsRacun.kreirajSavingsRacun('Ricko Kanic', 0, 'ricko999', 'pass999', banka);


