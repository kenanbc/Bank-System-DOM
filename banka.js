export class Banka{
    adresa;
    racuni = [];
    transakcije = [
        {racun: '9012751480565861', target: '5636346346436436', iznos: '- 1', datum: '2025-01-01'},
        {racun: '6246735754747553', target: '6246735754747553', iznos: '+ 200', datum: '2025-02-01'}
    ];

    constructor(adresa){
        this.adresa = adresa;
    }
 
    dodajRacun(racun){
        this.racuni.push(racun);
    }

    dodajTransakciju(transakcija){
        this.transakcije.push(transakcija);
    }

    nePostojiRacun(brojRacuna){
        return !this.racuni.find((e) => e.getBrojRacuna === brojRacuna);
    }

    nadjiRacun(brojRacuna, username){
       return this.racuni.find((e) => e.getBrojRacuna === brojRacuna || e.username === username);
    }

    nadjiTransakcije(brojRacuna){
        return this.transakcije.filter((e) => e.racun === brojRacuna)
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
            this.dodajTransakciju({racun: srcRacun, target: targetRacun, iznos: iznos, datum: new Date()});
            return true; 
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

export class Racun{
    imeVlasnika;
    username;
    password;
    brojRacuna;
    iznosNaRacunu;

    constructor(imeVlasnika, iznosNaRacunu, username, password, brojRacuna){
        this.imeVlasnika = imeVlasnika;
        this.username = username;
        this.password = password;
        this.brojRacuna = brojRacuna;
        this.iznosNaRacunu = iznosNaRacunu;
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
        return this.iznosNaRacunu;
    }

    get getBrojRacuna(){
        return this.brojRacuna;
    }

    set setIznosNaRacunu(iznos){
        this.iznosNaRacunu = iznos;
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

export class CheckingRacun extends Racun {
    constructor(imeVlasnika, iznosNaRacunu, username, password, brojRacuna, banka) {
        super(imeVlasnika, iznosNaRacunu, username, password, brojRacuna);
        this.tipRacuna = 'Checking';
        banka.dodajRacun(this);
    }

    static kreirajCheckingRacun(imeVlasnika, iznosNaRacunu, username, password, brojRacuna, banka) {
        if (iznosNaRacunu < 0)
            return `Nije dozvoljeno kreiranje racuna sa negativnim iznosom!`;

        return new CheckingRacun(imeVlasnika, iznosNaRacunu, username, password,brojRacuna, banka);
    }
}

export class SavingsRacun extends Racun{

    constructor(imeVlasnika, iznosNaRacunu, username, password, brojRacuna, banka){
        super(imeVlasnika, iznosNaRacunu, username, password, brojRacuna);
        this.tipRacuna = 'Savings';;
        banka.dodajRacun(this);
    }

    static kreirajSavingsRacun(imeVlasnika, iznosNaRacunu, username, password, brojRacuna, banka){
        if(iznosNaRacunu < 0)
            return `Nije dozvoljeno kreiranje racuna sa negativnim iznosom!`;
        
        return new SavingsRacun(imeVlasnika, iznosNaRacunu, username, password, brojRacuna, banka);
    }
};


const banka = new Banka("Mese Selimovica 1");

CheckingRacun.kreirajCheckingRacun(
 "Mujo Mujic",
  700,
  "a",
  "a",
  '9012751480565861', 
  banka
);
CheckingRacun.kreirajCheckingRacun(
  "Niko Nikic",
  500,
  "niko456",
  "pass456",
  '5636346346436436',
  banka
);

SavingsRacun.kreirajSavingsRacun(
    "Bob Hodzic",
     1200,
     "bobi",
     "bob123",
     '6246735754747553', 
     banka
   );

export { banka} ;
