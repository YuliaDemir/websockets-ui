import { db } from '../db.js';
export function generateId(type) {
    switch (type) {
        case 'room':
            {
                const sortedArray = [...db.rooms.entries()].sort((a, b) => a[0] - b[0]);
                const id = sortedArray.length > 0 ? sortedArray[sortedArray.length - 1][0] + 1 : 0;
                return id;
            }
            ;
    }
    ;
    throw new Error;
}
;
