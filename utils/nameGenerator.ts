export const FIRST_NAMES = [
    "Albert", "Marie", "Isaac", "Nikola", "Ada", "Alan", "Grace", "Rosalind", "Richard", "Stephen",
    "Niels", "Erwin", "Werner", "Enrico", "Lise", "Sarah", "David", "Jessica", "Robert", "Emily",
    "Michael", "Jennifer", "Thomas", "Elizabeth", "James", "Patricia", "John", "Linda", "William", "Barbara"
];

export const LAST_NAMES = [
    "Einstein", "Curie", "Newton", "Tesla", "Lovelace", "Turing", "Hopper", "Franklin", "Feynman", "Hawking",
    "Bohr", "Schrodinger", "Heisenberg", "Fermi", "Meitner", "Bennett", "Foster", "Clarke", "Wright", "Mitchell",
    "Hayes", "Simmons", "Peterson", "Bryant", "Webb", "Griffin", "Diaz", "Myers", "Ford", "Ross"
];

export const generateResearcherName = (): string => {
    const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    // Return format: "Albert Einstein"
    return `${first} ${last}`;
};
