export const categories = [
  { id: 'work', label: 'Praca / Szef', icon: '💼' },
  { id: 'social', label: 'Spotkanie / Piwo', icon: '🍺' },
  { id: 'family', label: 'Rodzina / Obiad', icon: '🏠' },
  { id: 'school', label: 'Szkoła / Uczelnia', icon: '🎓' },
];

export const excusesData = {
  work: {
    intro: [
      "Szefie, nie uwierzysz, ale",
      "Przepraszam za spóźnienie, musiałem",
      "To brzmi absurdalnie, ale",
      "Niestety nie dotrę dzisiaj, ponieważ",
      "Mój budzik zadzwonił, ale potem"
    ],
    scapegoat: [
      "mój kot",
      "sąsiad z dołu",
      "system operacyjny mojej lodówki",
      "przypadkowy przechodzień",
      "stado dzikich dzików",
      "Elan Musk osobiście",
      "duch mojej prababci"
    ],
    action: [
      "zjadł moje kluczyki do samochodu",
      "zablokował wyjście z klatki schodowej",
      "wypowiedział wojnę domofonowi",
      "przeprowadził atak DDoS na mój ekspres do kawy",
      "ukradł mi buty i uciekł na drzewo",
      "rozpoczął strajk głodowy pod moimi drzwiami"
    ],
    consequence: [
      "i teraz czekam na negocjatora z policji.",
      "więc muszę czekać na serwisanta z NASA.",
      "dlatego jestem uwięziony we własnym mieszkaniu.",
      "i niestety muszę składać zeznania.",
      "a ja nie mogę wyjść bez butów, bo to nieprofesjonalne.",
      "i teraz próbuję odzyskać godność."
    ]
  },
  social: {
    intro: [
      "Słuchaj stary, nie dam rady, bo",
      "Wybacz, ale sytuacja jest krytyczna,",
      "Chciałem przyjść, przysięgam, ale",
      "To siła wyższa,",
      "Muszę przełożyć piwo, ponieważ"
    ],
    scapegoat: [
      "moja wewnętrzna bogini",
      "kurier z Amazonu",
      "mój pesymizm",
      "wirtualny asystent",
      "hydraulik amator",
      "jakiś gość w stroju banana"
    ],
    action: [
      "dostał ataku paniki na widok moich spodni",
      "zalał mi mieszkanie łzami",
      "przekonał mnie, że wychodzenie z domu to błąd",
      "zablokował mi drzwi meblościanką",
      "postanowił zrobić remont generalny o 22:00",
      "zasnął w mojej wannie"
    ],
    consequence: [
      "i teraz muszę to wszystko sprzątać.",
      "więc mam areszt domowy do odwołania.",
      "i po prostu nie mam siły z tym walczyć.",
      "dlatego muszę zostać i pilnować sytuacji.",
      "a wiesz, że z tym nie ma żartów.",
      "i czuję, że to znak od wszechświata."
    ]
  },
  family: {
    intro: [
      "Mamo, tato, nie przyjadę, bo",
      "Kochanie, spóźnię się na obiad, ponieważ",
      "Wiem, że miałem być, ale",
      "Sytuacja rodzinna, ale nie nasza -",
      "To brzmi jak żart, ale"
    ],
    scapegoat: [
      "pies sąsiadów",
      "zaginiony wujek z Ameryki",
      "komornik (chyba pomyłka)",
      "dostawca pizzy",
      "moja pralka",
      "telewizor"
    ],
    action: [
      "zjadł prezent dla cioci",
      "zajął moje miejsce parkingowe i nie chce wyjechać",
      "wyprał mi jedyne czyste spodnie w trybie gotowania",
      "eksplodował w najmniej odpowiednim momencie",
      "zaczął nadawać sygnały do kosmitów",
      "zabarykadował się w łazience"
    ],
    consequence: [
      "i teraz szukam weterynarza.",
      "więc czekam na lawetę.",
      "i nie mam w czym wyjść do ludzi.",
      "dlatego czekam na straż pożarną.",
      "i muszę to wyjaśnić z administracją osiedla.",
      "i negocjacje trwają."
    ]
  },
  school: {
    intro: [
      "Panie profesorze, nie mam pracy domowej, bo",
      "Nie było mnie na lekcji, ponieważ",
      "Spóźniłem się, gdyż",
      "To wina systemu edukacji, ale też",
      "Miałem szczere chęci, ale"
    ],
    scapegoat: [
      "mój młodszy brat",
      "gang gołębi",
      "kierowca autobusu",
      "internet",
      "pies (klasyk)",
      "moje alter ego"
    ],
    action: [
      "skasował mi folder 'System32'",
      "porwał mój plecak dla okupu",
      "pomylił trasę i wywiózł mnie do innego miasta",
      "przestał działać w całej dzielnicy",
      "zjadł nie pracę, ale pendrive'a z pracą",
      "postanowił zostać influencerem"
    ],
    consequence: [
      "i teraz odzyskuję dane u informatyka.",
      "więc muszę negocjować z ptakami.",
      "dlatego wracam na piechotę.",
      "i nie mogłem wysłać pliku.",
      "i teraz czekamy aż go wydali... naturalnie.",
      "i nagrywamy tik-toki zamiast się uczyć."
    ]
  }
};

export const getRandomExcuse = (category: keyof typeof excusesData) => {
  const data = excusesData[category] || excusesData.work;
  const intro = data.intro[Math.floor(Math.random() * data.intro.length)];
  const scapegoat = data.scapegoat[Math.floor(Math.random() * data.scapegoat.length)];
  const action = data.action[Math.floor(Math.random() * data.action.length)];
  const consequence = data.consequence[Math.floor(Math.random() * data.consequence.length)];
  
  return `${intro} ${scapegoat} ${action}, ${consequence}`;
};
