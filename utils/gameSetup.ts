import { DifficultyLevel, Room, ROOM_STRUCTURE } from "../types";
import { ELEMENTS } from "../data/elements";

/**
 * Shuffles an array in place using the Fisher-Yates algorithm with crypto entropy.
 * @param array The array to shuffle.
 */
const shuffleArray = <T>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
        const randomBuffer = new Uint32Array(1);
        window.crypto.getRandomValues(randomBuffer);
        const j = randomBuffer[0] % (i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

export const generateGameRooms = (difficulty: DifficultyLevel): Room[] => {
    // Determine the pool of elements based on difficulty
    // Facile: only first 56 elements (up to Barium)
    // Intermedio & Difficile: all 94 elements
    const elementPool = difficulty === DifficultyLevel.Facile
        ? ELEMENTS.filter(el => el.atomicNumber <= 56)
        : ELEMENTS;

    // Shuffle the pool and pick the first 8
    const shuffledElements = shuffleArray([...elementPool]);
    const selectedElements = shuffledElements.slice(0, 8);

    // Combine the room structure with the selected elements
    const gameRooms: Room[] = ROOM_STRUCTURE.map((roomStructure, index) => {
        return {
            ...roomStructure,
            element: selectedElements[index]
        };
    });

    return gameRooms;
};