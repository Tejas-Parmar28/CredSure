// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateContract {
    struct Certificate {
        string name;
        string description;
        address sender;
        uint256 timestamp;
    }

    mapping(string => Certificate) certificates;

    event CertificateAdded(string ipfsHash, string name, string description, address sender, uint256 timestamp);

    function addCertificate(string memory ipfsHash, string memory name, string memory description) public {
        require(bytes(ipfsHash).length > 0, "IPFS hash is required");
        require(bytes(certificates[ipfsHash].name).length == 0, "Certificate with this IPFS hash already exists");

        Certificate memory newCertificate = Certificate(
            bytes(name).length > 0 ? name : "NA",
            bytes(description).length > 0 ? description : "NA",
            msg.sender,
            block.timestamp
        );

        certificates[ipfsHash] = newCertificate;
        emit CertificateAdded(ipfsHash, newCertificate.name, newCertificate.description, msg.sender, block.timestamp);
    }

    function getCertificate(string memory ipfsHash) public view returns (string memory, string memory, address, uint256) {
        Certificate memory certificate = certificates[ipfsHash];
        require(bytes(certificate.name).length > 0, "Certificate not found");
        return (certificate.name, certificate.description, certificate.sender, certificate.timestamp);
    }
}
