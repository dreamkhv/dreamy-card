class CardModes {
  private modes: CardMode[] = [
    { id: 'state', name: 'Состояние', domains: ['sensor'] },
    { id: 'stepper', name: 'Счётчик', domains: ['input_number'] },
    { id: 'switcher', name: 'Переключатель', domains: ['switch'] },
  ];

  public all(): CardMode[] {
    return this.modes;
  }

  public findOneByName(id: string): CardMode {
    for (const mode of this.modes) {
      if (mode.id === id) {
        return mode;
      }
    }

    throw new Error(`Unknown mode: ${id}`);
  }
}

interface CardMode {
  id: string;
  name: string;
  domains: string[];
}

export const modes = new CardModes();
