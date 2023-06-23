import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateRegisterDto {

    @ApiProperty()
    @IsNotEmpty()
    name: string;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()  
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;
    
}

