export type Props = {
    readonly params: Promise<{ id: string }>
    readonly searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
