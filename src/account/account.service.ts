import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityNotFoundError, Repository } from 'typeorm'
import { type Address, getAddress } from 'viem'

import type { SortInput } from '@/common/dtos/sort.input'
import { PaginationService } from '@/common/pagination.service'
import { SortingService } from '@/common/sorting.service'
import type { PaginatedAccounts } from '@/schema/entities'
import { AccountEntity } from '@/schema/entities'
import { generateAvatarURI } from '@/utils/generateAvatarURI'

import type { CreateAccountInput } from './dto/create-account.input'

@Injectable()
export class AccountService {
	constructor(
		@InjectRepository(AccountEntity)
		private accountRepository: Repository<AccountEntity>,
	) {}

	async createAccount(createAccountInput: CreateAccountInput): Promise<AccountEntity> {
		// throw new BadRequestException('Creating account: Not implemented')
		const checksumAddress = getAddress(createAccountInput.address)
		const account = this.accountRepository.create({
			onboardingSignature: createAccountInput.signature,
			address: checksumAddress,
			avatarUri: await generateAvatarURI(),
		})
		return await this.accountRepository.save(account)
	}

	// async findOrCreateAccount(createAccountInput: CreateAccountInput): Promise<AccountEntity> {
	// 	const checksumAddress = getAddress(createAccountInput.address)
	// 	const account = await this.accountRepository.findOneBy({ address: checksumAddress })
	// 	if (account) return account
	// 	const newAccount = await this.createAccount(createAccountInput)
	// 	return newAccount
	// }

	async findAll(sort?: SortInput | undefined): Promise<PaginatedAccounts> {
		const qb = this.accountRepository.createQueryBuilder('account')

		// Apply sorting
		if (sort) SortingService.applySorting(sort, qb)

		// Apply pagination
		const paginatedItems = await PaginationService.getPaginatedItems<AccountEntity>({
			classRef: AccountEntity,
			qb,
		})

		return paginatedItems
	}

	async findAccountByAddress(address: Address): Promise<AccountEntity> {
		// throw new BadRequestException('Finding account: Not implemented')
		const checksumAddress = getAddress(address)
		const account = await this.accountRepository.findOneBy({ address: checksumAddress })
		if (!account) throw new EntityNotFoundError(AccountEntity, { address })
		if (!account.avatarUri) await this.updateAvatarUri(account)
		return account
	}

	async updateAvatarUri(account: AccountEntity): Promise<AccountEntity> {
		account.avatarUri = await generateAvatarURI()
		return await this.accountRepository.save(account)
	}
}
