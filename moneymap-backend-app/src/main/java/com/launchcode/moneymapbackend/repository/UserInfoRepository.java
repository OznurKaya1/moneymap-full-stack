package com.launchcode.moneymapbackend.repository;

import com.launchcode.moneymapbackend.models.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, Long> {

    // Find a user by their email address
    Optional<UserInfo> findByEmail(String email);
}
