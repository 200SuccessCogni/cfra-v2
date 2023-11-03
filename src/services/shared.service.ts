export function validateEmail(email: string) {
    const re = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i;
    return re.test(email);
}

export function camelCaseToTitleCase(text: string) {
    const result = text.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
}

export function randomColor() {
    let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    while (color.length != 7) {
        color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    }
    return color;
}
