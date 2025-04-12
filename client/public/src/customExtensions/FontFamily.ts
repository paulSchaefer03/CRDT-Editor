import { Mark, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontFamily: {
      setFontFamily: (font: string) => ReturnType;
      unsetFontFamily: () => ReturnType;
    };
  }
}

const FontFamily = Mark.create({
  name: 'fontFamily',

  addOptions() {
    return {
      getAvailableFonts: getAvailableFonts,
    };
  },

  addAttributes() {
    return {
      font: {
        default: null,
        parseHTML: element => element.style.fontFamily.replace(/['\"]+/g, ''),
        renderHTML: attributes => {
          if (!attributes.font) {
            return {};
          }
          return { style: `font-family: ${attributes.font}` };
        },
      },
    };
  },

  parseHTML() {
    return [{ style: 'font-family' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setFontFamily:
        font =>
        ({ commands }) =>
          commands.setMark(this.name, { font }),
      unsetFontFamily:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    };
  },
});

const possibleFonts = ['Abadi MT Condensed Light', 'Albertus Extra Bold', 'Albertus Medium', 'Antique Olive', 
  'Arial', 'Arial Black', 'Arial MT', 'Arial Narrow', 'Bazooka', 'Book Antiqua', 'Bookman Old Style', 
  'Boulder', 'Calisto MT', 'Calligrapher', 'Century Gothic', 'Century Schoolbook', 'Cezanne', 'CG Omega', 
  'CG Times', 'Charlesworth', 'Chaucer', 'Clarendon Condensed', 'Comic Sans MS', 'Copperplate Gothic Bold', 
  'Copperplate Gothic Light', 'Cornerstone', 'Coronet', 'Courier', 'Courier New', 'Cuckoo', 'Dauphin', 'Denmark', 
  'Fransiscan', 'Garamond', 'Geneva', 'Haettenschweiler', 'Heather', 'Helvetica', 'Herald', 'Impact', 'Jester', 
  'Letter Gothic', 'Lithograph', 'Lithograph Light', 'Long Island', 'Lucida Console', 'Lucida Handwriting', 
  'Lucida Sans', 'Lucida Sans Unicode', 'Marigold', 'Market', 'Matisse ITC', 'MS LineDraw', 'News GothicMT', 
  'OCR A Extended', 'Old Century', 'Pegasus', 'Pickwick', 'Poster', 'Pythagoras', 'Sceptre', 'Sherwood', 
  'Signboard', 'Socket', 'Steamer', 'Storybook', 'Subway', 'Tahoma', 'Technical', 'Teletype', 'Tempus Sans ITC', 
  'Times', 'Times New Roman', 'Times New Roman PS', 'Trebuchet MS', 'Tristan', 'Tubular', 'Unicorn', 'Univers', 
  'Univers Condensed', 'Vagabond', 'Verdana', 'Westminster', 'Allegro', 'Amazone BT', 'AmerType Md BT', 
  'Arrus BT', 'Aurora Cn BT', 'AvantGarde Bk BT', 'AvantGarde Md BT', 'BankGothic Md BT', 'Benguiat Bk BT', 
  'BernhardFashion BT', 'BernhardMod BT', 'BinnerD', 'Bremen Bd BT', 'CaslonOpnface BT', 'Charter Bd BT', 
  'Charter BT', 'ChelthmITC Bk BT', 'CloisterBlack BT', 'CopperplGoth Bd BT', 'English 111 Vivace BT', 
  'EngraversGothic BT', 'Exotc350 Bd BT', 'Freefrm721 Blk BT', 'FrnkGothITC Bk BT', 'Futura Bk BT', 'Futura Lt BT', 
  'Futura Md BT', 'Futura ZBlk BT', 'FuturaBlack BT', 'Galliard BT', 'Geometr231 BT', 'Geometr231 Hv BT', 
  'Geometr231 Lt BT', 'GeoSlab 703 Lt BT', 'GeoSlab 703 XBd BT', 'GoudyHandtooled BT', 'GoudyOLSt BT', 
  'Humanst521 BT', 'Humanst 521 Cn BT', 'Humanst521 Lt BT', 'Incised901 Bd BT', 'Incised901 BT', 'Incised901 Lt BT', 
  'Informal011 BT', 'Kabel Bk BT', 'Kabel Ult BT', 'Kaufmann Bd BT', 'Kaufmann BT', 'Korinna BT', 'Lydian BT', 
  'Monotype Corsiva', 'NewsGoth BT', 'Onyx BT', 'OzHandicraft BT', 'PosterBodoni BT', 'PTBarnum BT', 'Ribbon131 Bd BT', 
  'Serifa BT', 'Serifa Th BT', 'ShelleyVolante BT', 'Souvenir Lt BT', 'Staccato222 BT', 'Swis721 BlkEx BT', 
  'Swiss911 XCm BT', 'TypoUpright BT', 'ZapfEllipt BT', 'ZapfHumnst BT', 'ZapfHumnst Dm BT', 'Zurich BlkEx BT', 
  'Zurich Ex BT'];

export function getAvailableFonts(): string[] {
  const availableFonts: string[] = [];

  possibleFonts.forEach(font => {
    if (isFontAvailable(font)) {
      availableFonts.push(font);
    }
  });

  return availableFonts;
}

function isFontAvailable(font: string): boolean {
  const testString = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const testSize = '72px';

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  context.font = `${testSize} monospace`;
  const defaultWidth = context.measureText(testString).width;

  context.font = `${testSize} '${font}', monospace`;
  const testWidth = context.measureText(testString).width;

  return testWidth !== defaultWidth;
}


export default FontFamily;
