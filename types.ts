
import { ReactElement } from "react";

export enum Screen {
    MainMenu,
    DifficultySelection,
    ElementRandomization,
    LabMap,
    Game,
    Victory,
}

export enum DifficultyLevel {
    Facile = 'FACILE',
    Intermedio = 'INTERMEDIO',
    Difficile = 'DIFFICILE',
}

export interface DifficultySetting {
    time: number; 
    attempts: number | null; // null for infinite
    icon: 'triangle' | 'tetrahedron' | 'icosahedron';
}

export const DIFFICULTY_SETTINGS: Record<DifficultyLevel, DifficultySetting> = {
    [DifficultyLevel.Facile]: { time: 180, attempts: null, icon: 'triangle' },
    [DifficultyLevel.Intermedio]: { time: 120, attempts: null, icon: 'tetrahedron' },
    [DifficultyLevel.Difficile]: { time: 60, attempts: null, icon: 'icosahedron' },
};

export type RoomTheme = "Storia e Proprietà" | "Biblioteca scientifica" | "Mix";

export interface ElementData {
    name: string;
    symbol: string;
    atomicNumber: number;
}

export interface Room {
  id: number;
  name: string;
  group: string;
  theme: RoomTheme;
  element: ElementData;
}

export interface Clue {
    text: string;
    type: string;
    cost?: number; // Optional cost for score calculation
}


export const ROOM_STRUCTURE: Omit<Room, 'element'>[] = [
    { id: 1, name: "Stanza 1", group: "Sala Laboratorio", theme: "Storia e Proprietà" },
    { id: 2, name: "Stanza 2", group: "Sala Laboratorio", theme: "Storia e Proprietà" },
    { id: 3, name: "Stanza 3", group: "Sala Laboratorio", theme: "Storia e Proprietà" },
    { id: 4, name: "Stanza 4", group: "Sala Laboratorio", theme: "Storia e Proprietà" },
    { id: 5, name: "Stanza 5", group: "Biblioteca scientifica", theme: "Biblioteca scientifica" },
    { id: 6, name: "Stanza 6", group: "Biblioteca scientifica", theme: "Biblioteca scientifica" },
    { id: 7, name: "Stanza 7", group: "Biblioteca scientifica", theme: "Biblioteca scientifica" },
    { id: 8, name: "Stanza 8", group: "Biblioteca scientifica", theme: "Biblioteca scientifica" },
];


export interface GameStats {
    totalTime: number;
    cluesUsed: number;
    correctAttempts: number;
    wrongAttempts: number;
}
