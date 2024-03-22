export const getCurrentEvent = () => {
    const currentDate = new Date();
    const feb24 = new Date('2024-02-24');
    const mar11 = new Date('2024-03-11');
    const mar30 = new Date('2024-03-30');

        const dateMap: { [key: string]: string } = {
            '2024-03-30': '2024cabe',
            '2024-03-11': '2024azgl',
            '2024-02-24': '2024casj',
        };
        let result = '2024casj'; // silicon
        for (const dateStr in dateMap) {
            const date = new Date(dateStr);
            if (currentDate > date) {
                result = dateMap[dateStr];
                break;
            }
        }
        return result;
    };
