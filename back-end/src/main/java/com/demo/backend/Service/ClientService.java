package com.demo.backend.Service;

import com.demo.backend.DTO.RegistrationRequest;
import com.demo.backend.Entity.Client;
import com.demo.backend.Repository.AdminRepository;
import com.demo.backend.Repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Client registerNewClient(RegistrationRequest request) {
        // 1. التحقق من تطابق كلمات المرور
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match!");
        }

        // 2. التحقق من وجود البريد الإلكتروني مسبقاً
        if (clientRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        // 3. التحديث الجديد: التحقق من وجود رقم الهاتف مسبقاً لمنع خطأ Duplicate entry
        // ملاحظة: تأكد من إضافة دالة existsByPhone في ملف ClientRepository
        if (clientRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Phone number is already in use!");
        }

        Client client = new Client();
        client.setFirstName(request.getFirstName()); //
        client.setLastName(request.getLastName());   //
        client.setEmail(request.getEmail());         //
        client.setPhone(request.getPhone());         //

        // تشفير كلمة المرور قبل الحفظ
        client.setPassword(passwordEncoder.encode(request.getPassword()));

        // تعيين دور العميل
        client.setRole("ROLE_CLIENT");

        // ربط العميل بالمسؤول (Admin) صاحب المعرف رقم 1
        adminRepository.findById(1).ifPresent(client::setAdmin);

        return clientRepository.save(client);
    }

    public Client updateClient(int id, Client clientDetails) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found")); //

        client.setFirstName(clientDetails.getFirstName()); //
        client.setLastName(clientDetails.getLastName());   //
        client.setPhone(clientDetails.getPhone());         //

        return clientRepository.save(client);
    }

    public void deleteClient(int id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found")); //
        clientRepository.delete(client); //
    }

    public Optional<Client> findById(Integer loggedUserId) {
        return clientRepository.findById(loggedUserId);
    }
}