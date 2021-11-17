import { IsDateString, IsNotEmpty, IsNumberString, MaxLength} from 'class-validator';
export class DataImportDto {
    @IsNotEmpty()
    @IsDateString()
    date: Date;

    @MaxLength(100)
    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    @IsNumberString()
    amount: number;

    @MaxLength(20)
    type: string;
}