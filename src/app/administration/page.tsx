import type { ReactElement } from 'react';

export default function Page() {
    return (
        <p>TESTTT</p>
    )
}

Page.getLayout = function getLayout(page: ReactElement) {
    return (
        <div style={{ backgroundColor: "red" }}>
            {page}
        </div>
    )
}
