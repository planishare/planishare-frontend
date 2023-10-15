export function cloneAsJson(value: any): any {
    return JSON.parse(JSON.stringify(value));
}
