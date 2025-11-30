export const FIRST_NAMES = [
    "Albert", "Marie", "Isaac", "Nikola", "Ada", "Alan", "Grace", "Rosalind", "Richard", "Stephen",
    "Niels", "Erwin", "Werner", "Enrico", "Lise", "Chien-Shiung", "Katherine", "Dorothy", "Mary",
    "Linus", "Tim", "Steve", "Bill", "Elon", "Jeff", "Mark", "Satya", "Sundar", "Jensen", "Lisa"
];

export const LAST_NAMES = [
    "Einstein", "Curie", "Newton", "Tesla", "Lovelace", "Turing", "Hopper", "Franklin", "Feynman", "Hawking",
    "Bohr", "Schrodinger", "Heisenberg", "Fermi", "Meitner", "Wu", "Johnson", "Vaughan", "Jackson",
    "Torvalds", "Berners-Lee", "Jobs", "Gates", "Musk", "Bezos", "Zuckerberg", "Nadella", "Pichai", "Huang", "Su"
];

export const generateResearcherName = (): string => {
    const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    // Return format: "A. Einstein"
    return `${first.charAt(0)}. ${last}`;
};
