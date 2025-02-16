import { IsDefined, IsEnum, IsEthereumAddress, IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator'
import { Address } from 'viem'

import { EStemType } from '@/schema/enums/stem-type.enum'

export class UploadFileDto {
	@IsDefined()
	@IsString()
	@IsNotEmpty()
	@MaxLength(50)
	name: string

	@IsDefined()
	@IsEnum(EStemType)
	type: EStemType

	@IsDefined()
	@IsUUID()
	projectId: string

	@IsDefined()
	@IsEthereumAddress()
	createdBy: Address
}
