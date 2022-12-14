import React, { useCallback, useEffect, useState } from 'react'
import {
  Stack,
  Flex,
  Heading,
  Text,
  Button,
  Image,
  Badge,
  useToast,
} from '@chakra-ui/react'
import useHandleNfts from '../../hooks/useHandleNfts'
import { useWeb3React } from '@web3-react/core'

const Home = () => {
  const [imageSrc, setImageSrc] = useState('')
  const { active, account } = useWeb3React()
  const virtualitoNFTs = useHandleNfts()
  const [maxStock, setmaxStock] = useState()
  const [isMinting, setIsMinting] = useState(false)

  const toast = useToast()

  const getvirtualitoNFTsData = useCallback(async () => {
    if (virtualitoNFTs) {
      const totalSupply = await virtualitoNFTs.methods.totalSupply().call()

      const dnaPreview = await virtualitoNFTs.methods
        .deterministicPseudoRandomDNA(totalSupply, account)
        .call()

      const image = await virtualitoNFTs.methods.imageByDNA(dnaPreview).call()

      const maxSupply = await virtualitoNFTs.methods.maxSuply().call()
      setmaxStock(maxSupply - totalSupply)

      setImageSrc(image)
    }
  }, [virtualitoNFTs, account])

  useEffect(() => {
    getvirtualitoNFTsData()
  }, [getvirtualitoNFTsData])

  const mint = () => {
    setIsMinting(true)

    virtualitoNFTs.methods
      .mint()
      .send({
        from: account,
      })
      .on('transactionHash', (txHash) => {
        toast({
          title: 'Transacción enviada',
          description: txHash,
          status: 'info',
        })
      })
      .on('receipt', () => {
        setIsMinting(false)
        toast({
          title: 'Transacción confirmada',
          description: 'La transacción fue exitosa.',
          status: 'success',
        })
      })
      .on('error', (error) => {
        setIsMinting(false)
        toast({
          title: 'Transacción fallida',
          description: error.message,
          status: 'error',
        })
      })
  }

  return (
    <Stack
      align={'center'}
      spacing={{ base: 8, md: 10 }}
      py={{ base: 10, md: 18 }}
      direction={{ base: 'column-reverse', md: 'row' }}
    >
      <Stack flex={1} spacing={{ base: 5, md: 10 }}>
        <Heading
          lineHeight={1.1}
          fontWeight={600}
          fontSize={{ base: '3xl', sm: '4xl', lg: '5xl' }}
        >
          <Text
            as={'span'}
            position={'relative'}
            _after={{
              content: "''",
              width: 'full',
              height: '25%',
              position: 'absolute',
              bottom: 1,
              left: 0,
              bg: 'purple.300',
              zIndex: -1,
            }}
          >
            CypherPunk Avatar
          </Text>
        </Heading>
        <Text color={'gray.500'}>
          Se trata de una colección de 10000 avatares únicos. Que representan
          simbólicamente a la lista de los cypherpunks de mundovirtual. Para
          rendir homenaje este proyecto trata de defender la privacidad con la
          criptografía, con firmas digitales, smart contracts y on-chain.
        </Text>

        <Text color={'gray.500'}>Qué esperas para ser parte cypherpunk?</Text>
        <Text color={'purple.500'}>
          {maxStock > 0 ? `Solo quedan ${maxStock}` : ``}
        </Text>

        <Stack
          spacing={{ base: 4, sm: 6 }}
          direction={{ base: 'column', sm: 'row' }}
        >
          <Button
            rounded={'full'}
            size={'lg'}
            fontWeight={'normal'}
            px={6}
            colorScheme={'purple'}
            bg={'purple.500'}
            _hover={{ bg: 'purple.400' }}
            disabled={!virtualitoNFTs}
            onClick={mint}
            isLoading={isMinting}
          >
            Quiero mi CypherPunk
          </Button>
        </Stack>
      </Stack>
      <Flex
        flex={1}
        direction="column"
        justify={'center'}
        align={'center'}
        position={'relative'}
        w={'full'}
      >
        <Image src={active ? imageSrc : 'https://avataaars.io/'} />
        {active ? (
          <>
            <Flex mt={2}>
              <Badge>
                Next ID:
                <Badge ml={1} colorScheme="green">
                  1
                </Badge>
              </Badge>
              <Badge ml={2}>
                Address:
                <Badge ml={1} colorScheme="green">
                  0x0000...0000
                </Badge>
              </Badge>
            </Flex>
            <Button
              onClick={getvirtualitoNFTsData}
              mt={4}
              size="xs"
              colorScheme="green"
            >
              Actualizar
            </Button>
          </>
        ) : (
          <Badge mt={2}>Wallet desconectada</Badge>
        )}
      </Flex>
    </Stack>
  )
}

export default Home
