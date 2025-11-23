import { DifficultyLevel, Clue } from "../types";
import { CSV_DATA } from "../data/csvData";

interface CsvElement {
    Elemento: string;
    Z: string;
    Simbolo: string;
    "Epoca scoperta": string;
    "Origine del nome": string;
    "Caratteristiche fisiche": string;
    "Caratteristiche chimiche": string;
    "Diffusione e sfruttamento": string;
    Utilizzo: string;
    "Curiosità I": string;
    "Curiosità II": string;
}

// Robust CSV Parser handling quotes and newlines inside fields
const parseCsv = (): CsvElement[] => {
    const text = CSV_DATA.trim();
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentVal = "";
    let inQuote = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"') {
            if (inQuote && nextChar === '"') {
                currentVal += '"';
                i++; // Skip escaped quote
            } else {
                inQuote = !inQuote;
            }
        } else if (char === ',' && !inQuote) {
            currentRow.push(currentVal.trim());
            currentVal = "";
        } else if (char === '\n' && !inQuote) {
            currentRow.push(currentVal.trim());
            rows.push(currentRow);
            currentRow = [];
            currentVal = "";
        } else if (char === '\r' && !inQuote) {
            // ignore CR
        } else {
            currentVal += char;
        }
    }
    if (currentVal || currentRow.length > 0) {
        currentRow.push(currentVal.trim());
        rows.push(currentRow);
    }

    // Map headers
    const headers = rows[0] as (keyof CsvElement)[];
    const data: CsvElement[] = [];

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        // Skip empty lines or malformed rows
        if (row.length < 2) continue; 

        const entry: any = {};
        headers.forEach((header, index) => {
            entry[header] = row[index] || "";
        });
        data.push(entry);
    }
    return data;
};

const ELEMENT_DB = parseCsv();

// Helper to split text into sentences
// 1. Splits by newline (primary separator)
// 2. Splits by period (secondary separator)
// 3. Pairs sentences if requested
const splitIntoSentences = (text: string, pairSentences: boolean = false): string[] => {
    if (!text) return [];
    
    // First, split by explicit newlines as requested ("punto a capo è un delimitatore")
    const newlineSegments = text.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    
    let finalSentences: string[] = [];

    newlineSegments.forEach(segment => {
        // For each segment, we might still want to split by period if it's a long paragraph,
        // unless it looks like a list item.
        // We split by period followed by space and a capital letter, or end of string.
        const parts = segment.split(/(?:\.|\?|!)\s+(?=[A-ZÀ-ÖØ-Þ])/).filter(s => s.trim().length > 5);
        
        if (parts.length === 0) {
            // If splitting resulted in nothing (e.g. short string), keep original if long enough
            if (segment.length > 2) finalSentences.push(segment.endsWith('.') ? segment : segment + '.');
        } else {
             parts.forEach(part => {
                let clean = part.trim();
                // Ensure it ends with punctuation
                if (!/[.?!]$/.test(clean)) clean += '.';
                finalSentences.push(clean);
             });
        }
    });

    if (!pairSentences) {
        return finalSentences;
    }

    // If pairing is requested, combine every two sentences
    const pairedSentences: string[] = [];
    for (let i = 0; i < finalSentences.length; i += 2) {
        if (i + 1 < finalSentences.length) {
            pairedSentences.push(finalSentences[i] + " " + finalSentences[i + 1]);
        } else {
            // If there's an odd number, push the last one as is
            pairedSentences.push(finalSentences[i]);
        }
    }
    return pairedSentences;
};

// Shuffle array
const shuffle = <T>(array: T[]): T[] => {
    return array.sort(() => Math.random() - 0.5);
};

export const generateClues = async (
    elementName: string, 
    theme: string, 
    count: number, // Deprecated but kept for signature compatibility
    difficulty: DifficultyLevel
): Promise<Clue[]> => {
    
    // Simulate network delay for game feel ("Analisi IA in corso...")
    await new Promise(resolve => setTimeout(resolve, 1000));

    const element = ELEMENT_DB.find(e => e.Elemento.toLowerCase() === elementName.toLowerCase());

    if (!element) {
        console.error(`Elemento ${elementName} non trovato nel database CSV.`);
        return [{ text: "Errore: Dati elemento mancanti.", type: "Errore" }];
    }

    let potentialClues: Clue[] = [];

    const addCluesFromColumn = (column: keyof CsvElement, typeName: string, pairMode: boolean = false) => {
        const text = element[column];
        const sentences = splitIntoSentences(text, pairMode);
        sentences.forEach(s => {
            if (s.length > 5) { 
                potentialClues.push({ text: s, type: typeName });
            }
        });
    };

    // Strict mapping based on rules:
    switch (theme) {
        case "Storia e Proprietà": // Rooms 1-4
            addCluesFromColumn("Epoca scoperta", "Storia");
            addCluesFromColumn("Origine del nome", "Etimologia");
            addCluesFromColumn("Caratteristiche fisiche", "Fisica", true);
            addCluesFromColumn("Caratteristiche chimiche", "Chimica", true);
            break;
        case "Biblioteca scientifica": // Rooms 5-8
            addCluesFromColumn("Diffusione e sfruttamento", "Diffusione");
            addCluesFromColumn("Utilizzo", "Uso");
            addCluesFromColumn("Curiosità I", "Curiosità");
            addCluesFromColumn("Curiosità II", "Curiosità");
            break;
        case "Mix":
        case "L'Enigma Finale": // Room 10 (if exists)
             addCluesFromColumn("Epoca scoperta", "Storia");
             addCluesFromColumn("Origine del nome", "Etimologia");
             addCluesFromColumn("Caratteristiche fisiche", "Fisica", true);
             addCluesFromColumn("Caratteristiche chimiche", "Chimica", true);
             addCluesFromColumn("Diffusione e sfruttamento", "Diffusione");
             addCluesFromColumn("Utilizzo", "Uso");
             addCluesFromColumn("Curiosità I", "Curiosità");
             addCluesFromColumn("Curiosità II", "Curiosità");
            break;
        default:
            // Fallback
            addCluesFromColumn("Utilizzo", "Uso");
            addCluesFromColumn("Curiosità I", "Curiosità");
    }


    // Filter out clues that contain the name or symbol too obviously
    const escapedSymbol = element.Simbolo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const symbolRegex = new RegExp(`\\b${escapedSymbol}\\b`, 'i'); 
    
    potentialClues = potentialClues.filter(c => {
        // Check for exact symbol match as a whole word
        if (symbolRegex.test(c.text)) return false;
        
        // Optional: Filter out name if desired, but dataset seems curated to avoid direct giveaways
        // if (c.text.toLowerCase().includes(elementName.toLowerCase())) return false;

        return true;
    });

    // Select clues to display
    let selectedClues = shuffle(potentialClues).slice(0, 6);

    if (selectedClues.length === 0) {
         selectedClues.push({ text: "Dati insufficienti per questo elemento in questa categoria.", type: "Info" });
    }

    return selectedClues;
};