import Image from "next/image";

async function Loading() {
    return (
        <div className="flex flex-col items-center py-3 gap-10">
            <Image
                src="/images/pikachu-loading.gif"
                width={220}
                height={160}
                alt="Chargement"
                unoptimized
            />
            <p className="rounded-2xl bg-[#f0e208] border-[#bf2819] border border-solid px-2 py-0.5">Chargement</p>
        </div>
    )
}

export default Loading;
