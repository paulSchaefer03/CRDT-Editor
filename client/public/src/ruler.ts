import { setPadding } from "./editor";
import * as Y from "yjs";
const dpi = 96;
const cmToPx = dpi / 2.54;

function setupRulers(documentEl: HTMLElement, yDoc: Y.Doc, paddingValues: { [key: string]: string }) {
    const paddingEl = document.getElementById('editor-padding')!;
    const hRuler = document.getElementById('ruler-horizontal')!;
    const vRuler = document.getElementById('ruler-vertical')!;
    const hoverPreview = document.createElement('div');
    hoverPreview.className = 'ruler-hover-preview';
    document.body.appendChild(hoverPreview);
  
    // Clear existing ticks and markers
    hRuler.innerHTML = '';
    vRuler.innerHTML = '';
  
    const docRect = documentEl.getBoundingClientRect();
    const widthPx = docRect.width;
    const heightPx = docRect.height;
    const widthCm = widthPx / cmToPx;
    const heightCm = heightPx / cmToPx;
  
    hRuler.style.width = `${widthPx}px`;
    vRuler.style.height = `${heightPx}px`;
    hRuler.style.marginLeft = `${vRuler.offsetWidth + 8}px`; //Width of the Box Shadow (+8) of the Document 
  
    const step = 0.25;
  
    function createTick(cm: number, orientation: 'horizontal' | 'vertical') {
      const px = cm * cmToPx;
      if ((orientation === 'horizontal' && px > widthPx) ||
          (orientation === 'vertical' && px > heightPx)) return null;
  
      const tick = document.createElement('div');
      tick.classList.add('ruler-tick', `ruler-tick-${orientation}`);
  
      const mod = Math.round((cm % 1) * 100) / 100;
      const isMajor = Math.abs(mod - 0) < 0.001;
      const isMedium = Math.abs(mod - 0.5) < 0.001;
      const isMinor = Math.abs(cm % 0.25) < 0.001;
      const tickSize = isMajor ? '10px' : isMedium ? '6px' : isMinor ? '4px' : '2px';
  
      if (orientation === 'horizontal') {
        tick.style.height = tickSize;
        tick.style.width = '1px';
        tick.style.position = 'absolute';
        tick.style.left = `${px}px`;
      } else {
        tick.style.width = tickSize;
        tick.style.height = '1px';
        tick.style.position = 'absolute';
        tick.style.top = `${px}px`;
      }
  

      if (isMajor) {
        const label = document.createElement('div');
        label.className = 'ruler-major-label';
        label.style.position = 'absolute';
        label.style.fontSize = '11px';
        label.innerText = `${Math.floor(cm)}cm`;
  
        if (orientation === 'horizontal') {
          label.style.bottom = '45%';
          label.style.left = `${px - 11}px`;
          hRuler.appendChild(label);
        } else {
          label.style.right = '45%';
          label.style.top = `${px - 6}px`;
          vRuler.appendChild(label);
        }
        
        
      }
  
      tick.addEventListener('mousemove', (e) => {
        hoverPreview.style.display = 'block';
        if (orientation === 'horizontal') {
          const x = e.clientX;
          hoverPreview.style.left = `${x}px`;
          hoverPreview.style.top = `${hRuler.getBoundingClientRect().bottom}px`;
          hoverPreview.style.height = `${documentEl.offsetHeight}px`;
          hoverPreview.style.width = '1px';
        } else {
          const y = e.clientY;
          hoverPreview.style.left = `${vRuler.getBoundingClientRect().right}px`;
          hoverPreview.style.top = `${y}px`;
          hoverPreview.style.width = `${documentEl.offsetWidth}px`;
          hoverPreview.style.height = '1px';
        }
      });
  
      tick.addEventListener('mouseleave', () => {
        hoverPreview.style.display = 'none';
      });
  
      return tick;
    }
  
    for (let cm = 0; cm <= widthCm; cm += step) {
      const rounded = Math.round(cm * 100) / 100;
      const tick = createTick(rounded, 'horizontal');
      if (tick) hRuler.appendChild(tick);
    }
  
    for (let cm = 0; cm <= heightCm; cm += step) {
      const rounded = Math.round(cm * 100) / 100;
      const tick = createTick(rounded, 'vertical');
      if (tick) vRuler.appendChild(tick);
    }
  
    // Remove existing markers if any
    hRuler.querySelectorAll('.ruler-marker, .ruler-handle').forEach(el => el.remove());
    vRuler.querySelectorAll('.ruler-marker, .ruler-handle').forEach(el => el.remove());
  
    createAdjustableMarker(hRuler, 'horizontal', 'Left', paddingEl, widthPx, hoverPreview, yDoc, paddingValues['left']);
    createAdjustableMarker(hRuler, 'horizontal', 'Right', paddingEl, widthPx, hoverPreview, yDoc, paddingValues['right']);
    createAdjustableMarker(vRuler, 'vertical', 'Top', paddingEl, heightPx, hoverPreview, yDoc, paddingValues['top']);
    createAdjustableMarker(vRuler, 'vertical', 'Bottom', paddingEl, heightPx, hoverPreview, yDoc, paddingValues['bottom']);
  }
  
  function createAdjustableMarker(
    parentRuler: HTMLElement,
    orientation: 'horizontal' | 'vertical',
    side: 'Top' | 'Left' | 'Bottom' | 'Right',
    paddingEl: HTMLElement,
    totalSize: number,
    hoverPreview: HTMLElement,
    yDoc: Y.Doc,
    initialValue: string
  ) {
    const dpi = 96;
    const cmToPx = dpi / 2.54;
    const isReverse = side === 'Right' || side === 'Bottom';
  
    const marker = document.createElement('div');
    marker.className = `ruler-marker ${orientation}`;
  
    const handle = document.createElement('div');
    handle.className = `ruler-handle ${orientation}`;
  
    parentRuler.appendChild(marker);
    parentRuler.appendChild(handle);
  //Das ist nix so wird immer die Handler auf 2.5cm gesetzt
    let position = 0;
    if (typeof initialValue === 'string' && initialValue.endsWith('px')) {
      initialValue = initialValue.slice(0, -2);
      position = parseFloat(initialValue);
    }
    
    if(orientation === 'horizontal' && side === 'Left') {
      position = parseFloat(initialValue);
    }else if(orientation === 'horizontal' && side === 'Right') {
      position = totalSize - parseFloat(initialValue);
    }else if(orientation === 'vertical' && side === 'Top') {
      position = parseFloat(initialValue);
    }else if(orientation === 'vertical' && side === 'Bottom') {
      position = totalSize - parseFloat(initialValue);
    }

    const update = () => {
      //const pos = isReverse ? totalSize - position : position;
      let pos = position;
      if (orientation === 'horizontal') {
        marker.style.left = `${position}px`;
        handle.style.left = `${position}px`;
      } else {
        marker.style.top = `${position}px`;
        handle.style.top = `${position}px`;
      }
      const cm = (pos / cmToPx).toFixed(2);
      handle.innerText = `${cm}cm`;
      pos = isReverse ? totalSize - position : position;
      paddingEl.style[`padding${side}` as any] = `${pos}px`;
  
      // Live update hover line while dragging
      hoverPreview.style.display = 'block';
      if (orientation === 'horizontal') {
        hoverPreview.style.left = `${position + parentRuler.getBoundingClientRect().left}px`;
        hoverPreview.style.top = `${parentRuler.getBoundingClientRect().bottom}px`;
        hoverPreview.style.height = `${paddingEl.offsetHeight}px`;
        hoverPreview.style.width = '1px';
      } else {
        hoverPreview.style.left = `${parentRuler.getBoundingClientRect().right}px`;
        hoverPreview.style.top = `${position + parentRuler.getBoundingClientRect().top}px`;
        hoverPreview.style.width = `${paddingEl.offsetWidth}px`;
        hoverPreview.style.height = '1px';
      }
    };
  
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      const rect = parentRuler.getBoundingClientRect();
      let coord = orientation === 'horizontal'
      ? e.clientX - rect.left
      : e.clientY - rect.top;
    
      const pxPerStep = cmToPx * 0.25; //Snap Grid 0.25cm
      coord = Math.round(coord / pxPerStep) * pxPerStep;
      
      position = Math.max(0, Math.min(totalSize, coord));
      update();
    };
  
    const onMouseUp = () => {
      dragging = false;
      handle.classList.remove('dragging');
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      hoverPreview.style.display = 'none';
      let pos = isReverse ? totalSize - position : position;
      setPadding(side, pos, yDoc)
    };
  
    let dragging = false;
  
    handle.addEventListener('mousedown', (e) => {
      dragging = true;
      handle.style.transition = 'left 0.1s ease-out, top 0.1s ease-out';
      marker.style.transition = 'left 0.1s ease-out, top 0.1s ease-out';
      hoverPreview.style.transition = 'all 0.1s ease-out';
      handle.classList.add('dragging');
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      e.preventDefault();
    });
  
    handle.addEventListener('mousemove', (e) => {
      if (!dragging) {
        hoverPreview.style.display = 'block';
        if (orientation === 'horizontal') {
          const x = e.clientX;
          hoverPreview.style.left = `${x}px`;
          hoverPreview.style.top = `${parentRuler.getBoundingClientRect().bottom}px`;
          hoverPreview.style.height = `${paddingEl.offsetHeight + 10}px`; //+ .ruler-row gap pixel
          hoverPreview.style.width = '1px';
        } else {
          const y = e.clientY;
          hoverPreview.style.left = `${parentRuler.getBoundingClientRect().right}px`;
          hoverPreview.style.top = `${y}px`;
          hoverPreview.style.width = `${paddingEl.offsetWidth + 10}px`; //+ .ruler-column gap pixel
          hoverPreview.style.height = '1px';
        }
      }
    });
  
    handle.addEventListener('mouseleave', () => {
      if (!dragging){
        handle.style.transition = '';
        marker.style.transition = '';
        hoverPreview.style.transition = '';
        hoverPreview.style.display = 'none';
      } 
    });
  
    update();
  }
  
  export default setupRulers;

 export function updateRulerHandle(side: "Horizontal-Left" | "Vertical-Top" | "Horizontal-Right" | "Vertical-Bottom", px: number, documentEl: HTMLElement) {
    const isReverse = side === 'Horizontal-Right' || side === 'Vertical-Bottom';
    const docRect = documentEl.getBoundingClientRect();
    const widthPx = docRect.width;
    const heightPx = docRect.height;

    if (side === 'Horizontal-Right' || side === 'Horizontal-Left') {
    const handles = document.querySelectorAll(`.ruler-handle.horizontal`) as NodeListOf<HTMLElement>;
    const markers = document.querySelectorAll(`.ruler-marker.horizontal`) as NodeListOf<HTMLElement>;
      if (!handles || !markers ) return;
      if (handles.length != 2 || markers.length != 2) return;

        if(side === 'Horizontal-Left') {
            
            const handle = handles[0].offsetLeft < handles[1].offsetLeft ? handles[0] : handles[1];
            const marker = markers[0].offsetLeft < markers[1].offsetLeft ? markers[0] : markers[1];
            const pos = isReverse ? widthPx - px : px;
            marker.style.left = `${pos}px`;
            handle.style.left = `${pos}px`;
            const cm = (pos / cmToPx).toFixed(2); // Convert to cm from mm
            handle.innerText = `${cm}cm`;
        }
        else {
            const handle = handles[0].offsetLeft > handles[1].offsetLeft ? handles[0] : handles[1];
            const marker = markers[0].offsetLeft > markers[1].offsetLeft ? markers[0] : markers[1];
            const pos = isReverse ? widthPx - px : px;
            marker.style.left = `${pos}px`;
            handle.style.left = `${pos}px`;
            const cm = (pos / cmToPx).toFixed(2); // Convert to cm from mm
            handle.innerText = `${cm}cm`;
        }
        
    } else {
        const handles = document.querySelectorAll(`.ruler-handle.vertical`) as NodeListOf<HTMLElement>;
        const markers = document.querySelectorAll(`.ruler-marker.vertical`) as NodeListOf<HTMLElement>;
          if (!handles || !markers ) return;
          if (handles.length != 2 || markers.length != 2) return;
            if(side === 'Vertical-Top') {
                const handle = handles[0].offsetTop < handles[1].offsetTop ? handles[0] : handles[1];
                const marker = markers[0].offsetTop < markers[1].offsetTop ? markers[0] : markers[1];
                const pos = isReverse ? heightPx - px : px;
                marker.style.top = `${pos}px`;
                handle.style.top = `${pos}px`;
                const cm = (pos / cmToPx).toFixed(2);
                handle.innerText = `${cm}cm`;
            }
            else {
                const handle = handles[0].offsetTop > handles[1].offsetTop ? handles[0] : handles[1];
                const marker = markers[0].offsetTop > markers[1].offsetTop ? markers[0] : markers[1];
                const pos = isReverse ? heightPx - px : px;
                marker.style.top = `${pos}px`;
                handle.style.top = `${pos}px`;
                const cm = (pos / cmToPx).toFixed(2);
                handle.innerText = `${cm}cm`;
            }

    }


  }
  
  