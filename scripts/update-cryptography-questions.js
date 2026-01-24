
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Updating exam questions to Cryptography set...');

    const exam = await prisma.exam.findFirst({
        where: { title: 'General Knowledge Exam' }
    });

    if (!exam) {
        console.error('Exam not found. Please run seed first.');
        return;
    }

    // Delete existing questions
    await prisma.question.deleteMany({
        where: { examId: exam.id }
    });

    const questionsData = [
        { text: "What is cryptography primarily used for?", options: ["Data confidentiality", "Data compression", "Data deletion", "Data formatting"], correct: "A" },
        { text: "Which of the following is a symmetric key algorithm?", options: ["RSA", "AES", "ECC", "DSA"], correct: "B" },
        { text: "Which algorithm is widely used for public key encryption?", options: ["DES", "AES", "RSA", "MD5"], correct: "C" },
        { text: "What does AES stand for?", options: ["Advanced Encryption Standard", "Automatic Encryption System", "Advanced Encoding Scheme", "Applied Encryption Standard"], correct: "A" },
        { text: "Which key is used for encryption in asymmetric cryptography?", options: ["Private key", "Public key", "Secret key", "Session key"], correct: "B" },
        { text: "Which key is kept secret in symmetric cryptography?", options: ["Public key", "Private key", "Shared secret key", "Certificate"], correct: "C" },
        { text: "What is the full form of RSA?", options: ["Random Secure Algorithm", "Rivest–Shamir–Adleman", "Reliable Security Algorithm", "Restricted Secure Access"], correct: "B" },
        { text: "Which cryptographic function produces a fixed-length output?", options: ["Encryption", "Decryption", "Hashing", "Encoding"], correct: "C" },
        { text: "Which of the following is a hashing algorithm?", options: ["AES", "RSA", "SHA-256", "DES"], correct: "C" },
        { text: "What is the main goal of hashing?", options: ["Confidentiality", "Integrity", "Availability", "Compression"], correct: "B" },
        { text: "Which attack tries all possible keys?", options: ["Dictionary attack", "Brute force attack", "Replay attack", "MITM attack"], correct: "B" },
        { text: "What is a digital signature used for?", options: ["Data encryption", "Data compression", "Authentication and integrity", "Data storage"], correct: "C" },
        { text: "Which algorithm is commonly used for digital signatures?", options: ["AES", "RSA", "DES", "RC4"], correct: "B" },
        { text: "What does SSL/TLS provide?", options: ["Data storage", "Secure communication", "Data backup", "File compression"], correct: "B" },
        { text: "Which cryptographic concept ensures data is not altered?", options: ["Confidentiality", "Integrity", "Authentication", "Authorization"], correct: "B" },
        { text: "What is a ciphertext?", options: ["Original message", "Encrypted message", "Decrypted message", "Hashed value"], correct: "B" },
        { text: "Which of the following is NOT a property of a good hash function?", options: ["Deterministic", "Reversible", "Collision resistant", "Fixed output length"], correct: "B" },
        { text: "Which key size is considered more secure?", options: ["64-bit", "128-bit", "256-bit", "32-bit"], correct: "C" },
        { text: "Which cryptographic technique uses the same key for encryption and decryption?", options: ["Asymmetric cryptography", "Symmetric cryptography", "Hashing", "Steganography"], correct: "B" },
        { text: "What is steganography?", options: ["Encrypting data", "Hashing data", "Hiding data within media", "Deleting data"], correct: "C" },
        { text: "Which algorithm is used in Bitcoin mining?", options: ["MD5", "SHA-256", "AES", "DES"], correct: "B" },
        { text: "Which protocol secures web communication?", options: ["HTTP", "FTP", "HTTPS", "SMTP"], correct: "C" },
        { text: "What is the purpose of a nonce?", options: ["Store keys", "Prevent replay attacks", "Encrypt data", "Compress data"], correct: "B" },
        { text: "Which attack targets hash functions?", options: ["Collision attack", "Brute force attack", "Phishing", "Spoofing"], correct: "A" },
        { text: "Which of the following is an example of asymmetric cryptography?", options: ["AES", "DES", "RSA", "RC4"], correct: "C" },
        { text: "What does CIA stand for in security?", options: ["Central Intelligence Agency", "Confidentiality, Integrity, Availability", "Control, Integrity, Access", "Confidentiality, Identity, Access"], correct: "B" },
        { text: "Which encryption converts plaintext into unreadable form?", options: ["Hashing", "Encoding", "Encryption", "Compression"], correct: "C" },
        { text: "Which is faster?", options: ["Asymmetric encryption", "Symmetric encryption", "Hashing", "Encoding"], correct: "B" },
        { text: "What is key management?", options: ["Storing data", "Generating, storing, and distributing keys", "Encrypting passwords", "Hashing data"], correct: "B" },
        { text: "Which algorithm replaced DES?", options: ["RSA", "AES", "RC4", "MD5"], correct: "B" },
        { text: "What is a brute force attack?", options: ["Guessing passwords using dictionary", "Trying all possible keys", "Stealing encryption keys", "Reusing keys"], correct: "B" },
        { text: "Which key is shared publicly?", options: ["Private key", "Secret key", "Public key", "Session key"], correct: "C" },
        { text: "Which of the following ensures authentication?", options: ["Hashing", "Digital signatures", "Compression", "Encoding"], correct: "B" },
        { text: "What is a man-in-the-middle attack?", options: ["Blocking communication", "Intercepting communication", "Encrypting data", "Hashing data"], correct: "B" },
        { text: "Which algorithm uses a 128-bit block size?", options: ["DES", "AES", "RSA", "MD5"], correct: "B" },
        { text: "Which cryptographic method verifies user identity?", options: ["Encryption", "Authentication", "Hashing", "Compression"], correct: "B" },
        { text: "What is a hash collision?", options: ["Same input, different output", "Different inputs, same output", "Encrypted data", "Decrypted data"], correct: "B" },
        { text: "Which algorithm is based on elliptic curves?", options: ["RSA", "AES", "ECC", "DES"], correct: "C" },
        { text: "What is the output of encryption called?", options: ["Plaintext", "Ciphertext", "Hash", "Signature"], correct: "B" },
        { text: "Which is NOT a symmetric algorithm?", options: ["AES", "DES", "RSA", "Blowfish"], correct: "C" },
        { text: "Which cryptography is used in HTTPS?", options: ["Symmetric only", "Asymmetric only", "Both symmetric and asymmetric", "Hashing only"], correct: "C" },
        { text: "What does PKI stand for?", options: ["Public Key Infrastructure", "Private Key Interface", "Protected Key Index", "Public Key Internet"], correct: "A" },
        { text: "Which attack exploits reused keys?", options: ["Replay attack", "Brute force attack", "Phishing", "Spoofing"], correct: "A" },
        { text: "What is salting in hashing?", options: ["Encrypting data", "Adding random data to input", "Compressing data", "Encoding data"], correct: "B" },
        { text: "Which algorithm is considered obsolete?", options: ["AES", "RSA", "DES", "SHA-256"], correct: "C" },
        { text: "Which cryptographic goal ensures secrecy?", options: ["Integrity", "Availability", "Confidentiality", "Authentication"], correct: "C" },
        { text: "What is decryption?", options: ["Converting plaintext to ciphertext", "Converting ciphertext to plaintext", "Hashing data", "Encoding data"], correct: "B" },
        { text: "Which algorithm is used for message authentication?", options: ["MAC", "AES", "DES", "RSA"], correct: "A" },
        { text: "What is key length?", options: ["Size of plaintext", "Size of ciphertext", "Number of bits in a key", "Number of users"], correct: "C" },
        { text: "Which technique hides information inside media?", options: ["Encryption", "Hashing", "Steganography", "Encoding"], correct: "C" }
    ];

    for (const q of questionsData) {
        await prisma.question.create({
            data: {
                text: q.text,
                options: JSON.stringify(q.options),
                correct: q.correct,
                examId: exam.id
            }
        });
    }

    console.log('Successfully updated 50 questions.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
