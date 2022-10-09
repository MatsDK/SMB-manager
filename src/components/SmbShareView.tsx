import { useAtomValue } from 'jotai'
import { useRouter } from 'preact-router'
import { useEffect, useState } from 'preact/hooks'
import { SmbSharesAtom } from '../utils/store'
import { DashboardLayout } from './DashboardView'

export const SmbShareView = ({}) => {
    const smbShares = useAtomValue(SmbSharesAtom)
    const [route] = useRouter()
    const [currShare, setCurrShare] = useState<Record<string, string>>(null!)

    useEffect(() => {
        if (!route?.matches?.name) return

        const share = smbShares.find(([name]) => name === route.matches!.name)
        if (share) setCurrShare(share[1])
    }, [route, smbShares])

    return (
        <DashboardLayout>
            <pre>
                {JSON.stringify(currShare, null, 2)}
            </pre>
        </DashboardLayout>
    )
}
