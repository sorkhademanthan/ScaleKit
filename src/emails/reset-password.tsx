import * as React from 'react';
import {
    Body,
    Button,
    Container,
    Head,
    Html,
    Preview,
    Section,
    Text,
    Tailwind,
} from '@react-email/components';

interface ResetPasswordEmailProps {
    userFirstname?: string;
    resetPasswordLink: string;
}

export const ResetPasswordEmail = ({
    userFirstname = 'there',
    resetPasswordLink,
}: ResetPasswordEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Reset your password for ScaleKit</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
                        <Section className="mt-[32px]">
                            <Text className="text-black text-[14px] leading-[24px]">
                                Hello {userFirstname},
                            </Text>
                            <Text className="text-black text-[14px] leading-[24px]">
                                Someone recently requested a password change for your ScaleKit account. If this was you, you can set a new password here:
                            </Text>
                            <Section className="text-center mt-[32px] mb-[32px]">
                                <Button
                                    className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                    href={resetPasswordLink}
                                >
                                    Reset password
                                </Button>
                            </Section>
                            <Text className="text-black text-[14px] leading-[24px]">
                                If you don't want to change your password or didn't request this, just ignore and delete this message.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default ResetPasswordEmail;
