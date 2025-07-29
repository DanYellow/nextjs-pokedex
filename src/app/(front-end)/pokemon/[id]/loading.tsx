import Image from "next/image";

async function Page() {
    return (
        <div>
            <Image
                src="/images/pikachu-loading.gif"
                width={439}
                height={321}
                alt="Chargement"
                className="block mx-auto scale-50"
            />
        </div>
    )
}

export default Page;
