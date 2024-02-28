export const getCurrentEvent = () => {
    const currentDate = new Date();
    const feb24 = new Date('2024-02-24');
    const mar11 = new Date('2024-03-11');
    const mar30 = new Date('2024-03-30');

    if (currentDate > feb24) {
        return '2024casj';
    } else if (currentDate > mar11) {
        return '2024azgl';
    } else if (currentDate > mar30) {
        return '2024cabe';
    } else {
        return '2024cabe';
    }
};
