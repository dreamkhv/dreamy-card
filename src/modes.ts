class CardModes {
  private modes: CardMode[] = [
    { domains: ['sensor'], id: 'state', name: 'Состояние' },
    { domains: ['input_number'], id: 'stepper', name: 'Счётчик' },
    { domains: ['switch'], id: 'switcher', name: 'Переключатель' },
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
