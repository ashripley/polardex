export interface Theme {
  bgColor: {
    bg1: string;
    bg2: string;
    bg3: string;
    bgFooter1: string;
  };
  textColor: {
    t1: string;
    t1Hover: string;
    t2: string;
    t2Hover: string;
    t3: string;
    t3Hover: string;
  };
  miscColor: {
    f1: string;
    f2: string;
    f3: string;
    f4: string;
    a1: string;
    a2: string;
    a3: string;
    a4: string;
    a5: string;
  };
}

export const theme: Theme = {
  bgColor: {
    bg1: '#ffffff',
    bg2: '#fbfbfc',
    bg3: '#f2f4f8',
    bgFooter1: '#f4f6f9',
  },
  textColor: {
    t1: '#4c566a',
    t1Hover: 'rgba(236, 239, 244, 0.4)',
    t2: 'rgb(123, 136, 161)',
    t2Hover: 'rgba(229, 233, 240, 0.75)',
    t3: '#d8dee9',
    t3Hover: 'rgba(236, 239, 244, 0.4)',
  },
  miscColor: {
    f1: '#8fbcbb',
    f2: '#88c0d0',
    f3: '#81a1c1',
    f4: '#5e81ac',
    a1: '#bf616a',
    a2: '#d08770',
    a3: '#ebcb8b',
    a4: '#a3be8c',
    a5: '#b48ead',
  },
};
