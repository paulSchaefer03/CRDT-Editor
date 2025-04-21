
const userCursorMap: Map<number, UserCursor> = new Map();

export function createAndAddUserCursor(
  uniqueUserID: number,
  color: string,
  name: string,
  parentElement: HTMLElement
): UserCursor {
  const userCursor = new UserCursor(uniqueUserID, color, name, parentElement);
  userCursorMap.set(uniqueUserID, userCursor);
  return userCursor;
}

export function addUserCursor(userCursor: UserCursor) {
  userCursorMap.set(userCursor['uniqueUserID'], userCursor);
}

export function removeUserCursor(userID: number) {
  const userCursor = userCursorMap.get(userID);
  if (userCursor) {
    userCursor.destroy();
    userCursorMap.delete(userID);
  }
}
export function getUserCursor(userID: number): UserCursor | undefined {
  return userCursorMap.get(userID);
}

export function getAllUserCursors(): Map<number, UserCursor> {
  return new Map(userCursorMap);
}

export function updateUserCursorPostion(userID: number) {
  const userCursor = userCursorMap.get(userID);
  if (userCursor) {
    userCursor.updatePosition();
  }
}

class UserCursor {
  private uniqueUserID: number;
  private color: string;
  private name: string;
  private wrapper: HTMLDivElement;
  private cursor: HTMLDivElement;
  private cursorDot: HTMLDivElement;
  private label: HTMLDivElement;
  private parentElement: HTMLElement;
  private invisibleCursor: HTMLDivElement;
  private cursorPosition: { left: number; top: number };
  private cursorDotPosition: { left: number; top: number };
  private labelPosition: { left: number; top: number };
  private paddingParentElement: Map<string, number>;
  private stopToggleCursorOpacity: boolean = false;

  constructor(uniqueUserID: number, color: string, name: string, parentElement: HTMLElement) {
    this.uniqueUserID = uniqueUserID;
    this.parentElement = parentElement;
    this.invisibleCursor = document.getElementById(`ivisible-user-cursor-${this.uniqueUserID}`) as HTMLDivElement; //sofern gültige ID, exsistiert das Element über den Cursorbuilder von Yjs
    this.color = color || '#007da9';
    this.name = name || 'Benutzer';

    this.wrapper = document.createElement('div');
    this.wrapper.className = 'user-cursor-wrapper';
    this.wrapper.id = `user-cursor-wrapper-${uniqueUserID}`;

    this.cursor = document.createElement('div');
    this.cursor.className = 'user-cursor';
    this.cursor.id = `user-cursor-${uniqueUserID}`;
    this.cursor.style.backgroundColor = this.color;

    this.cursorDot = document.createElement('div');
    this.cursorDot.className = 'user-cursor-dot';
    this.cursorDot.id = `user-cursor-dot-${uniqueUserID}`;
    this.cursorDot.style.backgroundColor = this.color;

    this.label = document.createElement('div');
    this.label.className = 'user-label-hover';
    this.label.id = `user-label-hover-${uniqueUserID}`;
    this.label.textContent = this.name;
    this.label.style.backgroundColor = this.color;
    this.label.style.borderColor = this.color;

    const isLightColor = (color: string) => {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5;
    };

    const textColor = isLightColor(this.color) ? '#000000' : '#FFFFFF';
    this.label.style.color = textColor;

    this.addEventListeners();

    this.paddingParentElement = new Map<'top' | 'left' | 'bottom' | 'right', number>();
    const computedStyle = window.getComputedStyle(this.parentElement);
    this.paddingParentElement.set('top', parseFloat(computedStyle.paddingTop) || 0);
    this.paddingParentElement.set('right', parseFloat(computedStyle.paddingRight) || 0);
    this.paddingParentElement.set('bottom', parseFloat(computedStyle.paddingBottom) || 0);
    this.paddingParentElement.set('left', parseFloat(computedStyle.paddingLeft) || 0);
    this.observeParentPaddingChanges();

    //initial positions
    this.cursorPosition = { left: this.paddingParentElement.get('left') || 0, top: this.paddingParentElement.get('top') || 0 };
    this.cursorDotPosition = { left: this.paddingParentElement.get('left') || 0, top: this.paddingParentElement.get('top') || 0 };
    this.labelPosition = { left: this.paddingParentElement.get('left') || 0, top: this.paddingParentElement.get('top') || 0 };

    this.cursor.appendChild(this.cursorDot);
    this.cursor.appendChild(this.label); 
    this.wrapper.appendChild(this.cursor);
    this.appendTo();
    //this.startToggleCursorOpacity();
  }

  public getHTMLElement(): HTMLDivElement {
    return this.wrapper;
  }

  public destroy() {
    this.stopToggleCursorOpacity = true;
    this.cursor.removeEventListener('mouseenter', this.handleCursorMouseEnter);
    this.cursor.removeEventListener('mouseleave', this.handleCursorMouseLeave);
    this.cursorDot.removeEventListener('mouseenter', this.handleCursorDotMouseEnter);
    this.cursorDot.removeEventListener('mouseleave', this.handleCursorDotMouseLeave);
    this.parentElement.removeChild(this.wrapper);
  }

  public update(color?: string, name?: string) {
    if (color) {
      this.color = color;
      this.cursor.style.backgroundColor = this.color;
      this.cursorDot.style.backgroundColor = this.color;
      this.label.style.backgroundColor = this.color;
      this.label.style.borderColor = this.color;

      const isLightColor = (color: string) => {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5;
      };

      const textColor = isLightColor(this.color) ? '#000000' : '#FFFFFF';
      this.label.style.color = textColor;
    }

    if (name) {
      this.name = name;
      this.label.textContent = this.name;
    }
  }

  private startToggleCursorOpacity() {
    const interval = setInterval(() => {
      if(this.stopToggleCursorOpacity) {
        console.log('Stop toggle cursor opacity', this.uniqueUserID);
        clearInterval(interval);
        return;
      }
      console.log('Toggle cursor opacity', this.uniqueUserID);
      if (this.cursor.style.opacity === '0') {
        this.cursor.style.opacity = '1';
        this.cursorDot.style.opacity = '1';
      } else {
        this.cursor.style.opacity = '0';
        this.cursorDot.style.opacity = '0';
      }
    }, 750);
  }


  public updatePosition(){
    console.log('Update position of user cursor', this.uniqueUserID);

    let elapsedTime = 0;
    const interval = 1;
    const timeout = 10;

    const intervalId = setInterval(() => {
      this.invisibleCursor = document.getElementById(`ivisible-user-cursor-${this.uniqueUserID}`) as HTMLDivElement;
      if (this.invisibleCursor === null) {
        console.log('Invisible cursor not found');
      }
      else {
        if (this.cursorPosition.left !== this.invisibleCursor.offsetLeft + (this.paddingParentElement.get('left') || 0)
          || this.cursorPosition.top !== this.invisibleCursor.offsetTop + (this.paddingParentElement.get('top') || 0)) {
       clearInterval(intervalId);
         const invisibleCursorPosition = {
           left: this.invisibleCursor.offsetLeft + (this.paddingParentElement.get('left') || 0),
           top: this.invisibleCursor.offsetTop + (this.paddingParentElement.get('top') || 0),
         };
         console.log('Cursor position has changed in ', elapsedTime, 'ms');
         //Style koordniaten für restliche logik ungeeignet
         const rect = this.invisibleCursor.getBoundingClientRect();
         const parentRect = this.parentElement.getBoundingClientRect();
         const left = rect.left - parentRect.left;
         const top = rect.top - parentRect.top;

         console.log('Cursor position:', invisibleCursorPosition.left, invisibleCursorPosition.top, "TEST: ", top, left);
         console.log('Old cursor position:', this.cursorPosition.left, this.cursorPosition.top);
         const cursorHeigth = this.invisibleCursor.offsetHeight;
         console.log('Invisible cursor height:', this.invisibleCursor);
         console.log('Line Height Invisible Cursor:', cursorHeigth);
         this.cursorPosition.left = invisibleCursorPosition.left;
         this.cursorPosition.top = invisibleCursorPosition.top;
         this.cursorDotPosition.left = invisibleCursorPosition.left;
         this.cursorDotPosition.top = invisibleCursorPosition.top;
         this.labelPosition.left = invisibleCursorPosition.left;
         this.labelPosition.top = invisibleCursorPosition.top;
         this.updateCursorLableDotPosition(top, left, cursorHeigth);
         return;
       }
      }
      if (elapsedTime >= timeout) {
        console.log('Timeout reached, stopping interval');
        clearInterval(intervalId);
        return;
      }
      elapsedTime += interval;
    }, interval);

  }

  private updateCursorLableDotPosition(top: number, left: number ,height: number | undefined) {
    if (height) {
      this.cursor.style.height = `${height}px`;
    }
    this.cursor.style.left = `${left}px`;
    this.cursor.style.top = `${top}px`;
  }

  private appendTo() {
    this.parentElement.appendChild(this.wrapper);
  }

  public handleCursorMouseEnter = () => {
    this.label.style.opacity = '1';
    this.cursorDot.style.opacity = '0';
  };

  public handleCursorMouseLeave = () => {
    setTimeout(() => {
      this.label.style.opacity = '0';
      this.cursorDot.style.opacity = '1';
    }, 2000);
  };

  public handleCursorDotMouseEnter = () => {
    this.label.style.opacity = '1';
    this.cursorDot.style.opacity = '0';
  };

  public handleCursorDotMouseLeave = () => {
    setTimeout(() => {
      this.label.style.opacity = '0';
      this.cursorDot.style.opacity = '1';
    }, 2000);
  };

  private addEventListeners() {
    this.cursor.addEventListener('mouseenter', this.handleCursorMouseEnter);

    this.cursor.addEventListener('mouseleave', this.handleCursorMouseLeave);

    this.cursorDot.addEventListener('mouseenter', this.handleCursorDotMouseEnter);

    this.cursorDot.addEventListener('mouseleave', this.handleCursorDotMouseLeave);
  }

  private observeParentPaddingChanges() {
    const observer = new MutationObserver(() => {
      const computedStyle = window.getComputedStyle(this.parentElement);
      this.paddingParentElement.set('top', parseFloat(computedStyle.paddingTop) || 0);
      this.paddingParentElement.set('right', parseFloat(computedStyle.paddingRight) || 0);
      this.paddingParentElement.set('bottom', parseFloat(computedStyle.paddingBottom) || 0);
      this.paddingParentElement.set('left', parseFloat(computedStyle.paddingLeft) || 0);
      //update postion and Padding of ALL cursors because of padding is relevant for all cursors
      const allCursors = getAllUserCursors();
      console.log('Padding of parent element has changed, updating cursor position', allCursors);
      allCursors.forEach((cursor) => { 
        cursor.paddingParentElement.set('top', parseFloat(computedStyle.paddingTop) || 0);
        cursor.paddingParentElement.set('right', parseFloat(computedStyle.paddingRight) || 0);
        cursor.paddingParentElement.set('bottom', parseFloat(computedStyle.paddingBottom) || 0);
        cursor.paddingParentElement.set('left', parseFloat(computedStyle.paddingLeft) || 0);
        cursor.updatePosition(); 
      });
    });

    observer.observe(this.parentElement, { attributes: true, attributeFilter: ['style'] });
  }
}



  