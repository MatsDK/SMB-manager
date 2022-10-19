export const compareFields = (initial: Record<string, string>, newFields: Record<string, string>) =>
    Object.entries(newFields).some(
        ([name, value]) => value !== (initial[name] || ''),
    )
